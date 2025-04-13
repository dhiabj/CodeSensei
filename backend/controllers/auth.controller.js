const authService = require('../services/auth.service');

async function register(req, res) {
  try {
    const { email, password } = req.body;
    const result = await authService.registerUser(email, password);
    res.status(201).json({ message: result.message });
  } catch (error) {
    const statusCode = error.message.includes('already in use') ? 409 : 500;
    res.status(statusCode).json({ message: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(200).json({ message: 'Logged in successfully!' });
  } catch (error) {
    let statusCode = 500;
    if (
      error.message.includes('verify your email') ||
      error.message.includes('Invalid email or password')
    )
      statusCode = 403;
    res.status(statusCode).json({ message: error.message });
  }
}

async function verifyEmail(req, res) {
  try {
    const { token } = req.params;
    await authService.verifyUserEmail(token);
    res.redirect(`${process.env.FRONTEND_URL}/login?type=confirm`);
  } catch (error) {
    let errorType = '';
    if (error.message.includes('Expired')) {
      errorType = 'expired';
    } else if (error.message.includes('Invalid')) {
      errorType = 'invalid';
    } else {
      errorType = 'general';
    }
    res.redirect(
      `${process.env.FRONTEND_URL}/login?type=${encodeURIComponent(errorType)}`
    );
  }
}

async function refreshToken(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(403).send('Access denied');
    const response = await authService.refresh(refreshToken);
    res.cookie('accessToken', response.newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', response.newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: 'Tokens refreshed' });
  } catch (error) {
    let statusCode = 500;
    if (error.message.includes('Invalid')) statusCode = 403;
    res.status(statusCode).json({ message: error.message });
  }
}

async function logout(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    await authService.logoutUser(refreshToken);
  } catch (error) {
    console.error('Error during logout', error);
  } finally {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
  }
}

module.exports = {
  register,
  login,
  verifyEmail,
  refreshToken,
  logout,
};
