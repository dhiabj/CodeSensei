const express = require('express');
const passport = require('passport');
const {
  login,
  register,
  verifyEmail,
  refreshToken,
  logout,
} = require('../controllers/auth.controller');
const isAuthorized = require('../middlewares/auth.middleware');
const { oauthTokenGen } = require('../services/auth.service');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/verify/:token', verifyEmail);
router.get('/protected', isAuthorized, (req, res) => {
  res.send('Protected data');
});

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

router.post('/refresh', refreshToken);
router.post('/logout', logout);

router.get('/:provider/callback', (req, res, next) => {
  passport.authenticate(
    req.params.provider,
    { session: false },
    async (err, user) => {
      try {
        if (err || !user) {
          console.error('OAuth error:', err);
          const errorMessage = encodeURIComponent(err.message);
          return res.redirect(
            `${process.env.FRONTEND_URL}/oauth?error=${errorMessage}`
          );
        }
        const { accessToken, refreshToken } = await oauthTokenGen(user._id);

        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'None',
          maxAge: 15 * 60 * 1000, // 15 minutes
        });

        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'None',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.redirect(`${process.env.FRONTEND_URL}/`);
      } catch (error) {
        console.error('OAuth callback error:', error);
        const errorMessage = encodeURIComponent(error.message);
        res.redirect(`${process.env.FRONTEND_URL}/oauth?error=${errorMessage}`);
      }
    }
  )(req, res, next);
});

module.exports = router;
