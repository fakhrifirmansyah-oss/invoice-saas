const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const UserModel = require('../models/userModel');
const { sendVerificationEmail } = require('./emailService');

class AuthService {
  static async register(name, email, password) {
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const user = await UserModel.create(name, email, hashedPassword, 'email', false, verificationToken);
    
    // Send email asynchronously
    sendVerificationEmail(user.email, verificationToken);

    return { message: 'Registration successful. Please check your email to verify your account.' };
  }

  static async verifyEmail(token) {
    const user = await UserModel.findByVerificationToken(token);
    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    await UserModel.markAsVerified(user.id);
    return { message: 'Email verified successfully. You can now log in.' };
  }

  static async login(email, password) {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.password && user.auth_provider === 'google') {
      throw new Error('Please login with Google');
    }

    if (!user.is_verified && user.auth_provider === 'email') {
      throw new Error('Please verify your email before logging in');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user.id);
    return { user: { id: user.id, name: user.name, email: user.email }, token };
  }

  static async googleAuth(idToken) {
    const { OAuth2Client } = require('google-auth-library');
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await UserModel.findByEmail(email);
    
    if (!user) {
      user = await UserModel.create(name, email, null, 'google');
    }

    const token = this.generateToken(user.id);
    return { user: { id: user.id, name: user.name, email: user.email }, token };
  }

  static generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
  }
}

module.exports = AuthService;
