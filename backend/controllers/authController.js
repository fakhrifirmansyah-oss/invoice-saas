const AuthService = require('../services/authService');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const result = await AuthService.register(name, email, password);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const result = await AuthService.verifyEmail(req.params.token);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.googleAuth = async (req, res, next) => {
  try {
    const { token } = req.body;
    const result = await AuthService.googleAuth(token);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Google authentication failed' });
  }
};
