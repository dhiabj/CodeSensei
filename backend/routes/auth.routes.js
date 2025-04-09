const express = require('express');
const passport = require('passport');

const {
  login,
  register,
  verifyEmail,
  checkToken,
  handleGoogleLogin,
} = require('../controllers/auth.controller');
const isAuthorized = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/verify/:token', verifyEmail);
router.get('/check-token', isAuthorized, checkToken);
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  handleGoogleLogin
);

module.exports = router;
