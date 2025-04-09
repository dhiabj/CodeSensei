const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {
  login,
  register,
  verifyEmail,
  checkToken,
} = require('../controllers/auth.controller');
const isAuthorized = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/verify/:token', verifyEmail);
router.get('/check-token', isAuthorized, checkToken);

router.get('/:provider', (req, res, next) => {
  const provider = req.params.provider;
  const providersConfig = {
    google: {
      scope: ['profile', 'email'],
      session: false,
    },
    github: {
      scope: ['user:email'],
      session: false,
    },
  };
  passport.authenticate(provider, providersConfig[provider])(req, res, next);
});

router.get('/:provider/callback', (req, res, next) => {
  passport.authenticate(
    req.params.provider,
    { session: false },
    (err, user, info) => {
      if (err || !user) {
        console.error('OAuth error:', err || info);
        return res.redirect(
          `${process.env.FRONTEND_URL}/oauth?error=${err.message}`
        );
      }
      // If authentication is successful:
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.redirect(`${process.env.FRONTEND_URL}/oauth?token=${token}`);
    }
  )(req, res, next);
});

module.exports = router;
