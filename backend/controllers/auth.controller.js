const authService = require('../services/auth.service');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

async function register(req, res) {
  try {
    const { email, password } = req.body;
    const result = await authService.registerUser(email, password);
    res.status(201).json({
      status: 'success',
      code: 201,
      message: result.message,
    });
  } catch (error) {
    const statusCode = error.message.includes('already in use') ? 409 : 500;
    res.status(statusCode).json({
      status: 'error',
      code: statusCode,
      message: error.message,
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.json({
      status: 'success',
      code: 200,
      token: result.token,
    });
  } catch (error) {
    let statusCode = 500;
    if (error.message.includes('verify your email')) statusCode = 403;
    if (error.message.includes('Invalid email or password')) statusCode = 401;

    res.status(statusCode).json({
      status: 'error',
      code: statusCode,
      message: error.message,
    });
  }
}

async function verifyEmail(req, res) {
  try {
    const { token } = req.params;
    const result = await authService.verifyUserEmail(token);
    res.json({
      status: 'success',
      code: 200,
      data: result,
    });
  } catch (error) {
    let statusCode = 500;
    if (error.message.includes('Expired')) statusCode = 410;
    if (error.message.includes('Invalid')) statusCode = 401;
    res.status(statusCode).json({
      status: 'error',
      code: statusCode,
      message: error.message,
    });
  }
}

const verifyToken = promisify(jwt.verify);

async function checkToken(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        status: 'error',
        code: 401,
        message: 'Unauthorized',
      });
    }
    const decoded = await verifyToken(token, process.env.JWT_SECRET);
    res.json({
      status: 'success',
      code: 200,
      data: {
        id: decoded.id,
        email: decoded.email,
      },
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({
      status: 'error',
      code: 401,
      message: 'Unauthorized',
    });
  }
}

function handleGoogleLogin(req, res) {
  try {
    if (!req.user) throw new Error('Authentication failed');
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}`);
  } catch (error) {
    console.error('Error during Google login:', error);
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Internal Server Error',
    });
  }
}

module.exports = {
  register,
  login,
  verifyEmail,
  checkToken,
  handleGoogleLogin,
};
