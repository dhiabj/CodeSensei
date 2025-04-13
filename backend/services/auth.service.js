const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const transporter = require('../config/email');
const emailTemplates = require('../utils/emailTemplates');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../utils/helpers');

const secret = process.env.EMAIL_TOKEN_SECRET;

async function registerUser(email, password) {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('Email already in use');

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = jwt.sign({ email }, secret, { expiresIn: '1d' });

  const user = new User({
    email,
    password: hashedPassword,
    verificationToken,
    verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
  });

  await user.save();

  const verificationUrl = `${process.env.BASE_URL}/api/auth/verify/${verificationToken}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your CodeSensei Account',
    html: emailTemplates.verificationEmail(verificationUrl),
  });

  return {
    message: 'Check your email to verify your account.',
  };
}

async function loginUser(email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid email or password');
  if (!user.isVerified)
    throw new Error('Please verify your email before logging in');
  if (user.provider !== 'local')
    throw new Error(`Please use ${user.provider} to login`);
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error('Invalid email or password');

  const accessToken = generateAccessToken(user._id);
  const { refreshToken, jti } = generateRefreshToken(user._id);

  user.refreshTokenJti = jti;
  await user.save();

  return { accessToken, refreshToken };
}

async function verifyUserEmail(token) {
  const decoded = jwt.verify(token, secret);
  const user = await User.findOne({
    email: decoded.email,
    verificationToken: token,
  });

  if (!user) throw new Error('Invalid verification token');
  if (user.verificationTokenExpires < Date.now())
    throw new Error('Expired verification token');

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  return { message: 'Email verified successfully! You can now log in.' };
}

async function findOrCreateOAuthUser(provider, profile) {
  const email = profile.emails?.[0]?.value;
  if (!email) throw new Error(`No email found with ${provider} account`);

  const idField = `${provider}Id`;
  const updateFields = {
    $setOnInsert: {
      [idField]: profile.id,
      provider,
      isVerified: true,
      password: undefined,
    },
  };

  const user = await User.findOneAndUpdate({ email }, updateFields, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });

  // Check for existing provider conflict
  if (!user[idField]) {
    const existingProviders = [];
    if (user.googleId) existingProviders.push('Google');
    if (user.githubId) existingProviders.push('GitHub');

    if (existingProviders.length > 0) {
      throw new Error(
        `Email already associated with ${existingProviders.join(
          ', '
        )} account(s)`
      );
    } else {
      throw new Error('Email already in use');
    }
  }

  return user;
}

async function refresh(refreshToken) {
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const user = await User.findById(decoded.id);
  if (!user || user.refreshTokenJti !== decoded.jti) {
    throw new Error('Invalid refresh token');
  }

  const newAccessToken = generateAccessToken(user._id);
  const { refreshToken: newRefreshToken, jti: newJti } = generateRefreshToken(
    user._id
  );

  user.refreshTokenJti = newJti;
  await user.save();

  return { newAccessToken, newRefreshToken };
}

async function logoutUser(refreshToken) {
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const user = await User.findById(decoded.id);
  if (user) {
    user.refreshTokenJti = null;
    await user.save();
  }
}

async function oauthTokenGen(userId) {
  // Generate tokens using your existing functions
  const accessToken = generateAccessToken(userId);
  const { refreshToken, jti } = generateRefreshToken(userId);

  // Update user with refresh token ID
  await User.findByIdAndUpdate(userId, { refreshTokenJti: jti });

  return { accessToken, refreshToken };
}

module.exports = {
  registerUser,
  loginUser,
  verifyUserEmail,
  findOrCreateOAuthUser,
  refresh,
  logoutUser,
  oauthTokenGen,
};
