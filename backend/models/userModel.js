const db = require('../config/db');

class UserModel {
  static async findByEmail(email) {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
  }

  static async findByVerificationToken(token) {
    const { rows } = await db.query('SELECT * FROM users WHERE verification_token = $1', [token]);
    return rows[0];
  }

  static async markAsVerified(userId) {
    const { rows } = await db.query(
      'UPDATE users SET is_verified = true, verification_token = NULL WHERE id = $1 RETURNING *',
      [userId]
    );
    return rows[0];
  }

  static async create(name, email, hashedPassword, authProvider = 'email', isVerified = false, verificationToken = null) {
    const { rows } = await db.query(
      'INSERT INTO users (name, email, password, auth_provider, is_verified, verification_token) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, auth_provider, is_verified',
      [name, email, hashedPassword, authProvider, isVerified, verificationToken]
    );
    return rows[0];
  }
}

module.exports = UserModel;
