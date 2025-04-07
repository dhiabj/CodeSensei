const authService = require('../services/auth.service');

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
    const user = await authService.checkUserToken(token);
    res.json({
      status: 'success',
      code: 200,
      data: user,
    });
  } catch (error) {
    res.status(401).json({
      status: 'error',
      code: 401,
      message: error.message,
    });
  }
}

module.exports = {
  register,
  login,
  verifyEmail,
  checkToken,
};
