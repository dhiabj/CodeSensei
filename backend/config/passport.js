const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const authService = require('../services/auth.service');

const configureStrategy = (provider, Strategy, providerScopes) => {
  passport.use(
    new Strategy(
      {
        clientID: process.env[`${provider.toUpperCase()}_CLIENT_ID`],
        clientSecret: process.env[`${provider.toUpperCase()}_CLIENT_SECRET`],
        callbackURL: process.env[`${provider.toUpperCase()}_CALLBACK_URL`],
        passReqToCallback: true,
        scope: providerScopes,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const user = await authService.findOrCreateOAuthUser(
            provider,
            profile
          );
          done(null, user);
        } catch (error) {
          console.error(`${provider} auth error:`, error);
          done(error);
        }
      }
    )
  );
};

configureStrategy('google', GoogleStrategy, ['profile', 'email']);
configureStrategy('github', GitHubStrategy, ['user:email']);
