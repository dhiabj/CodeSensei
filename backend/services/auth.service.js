const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const secret = process.env.JWT_SECRET;

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
    subject: 'Verify your email',
    html: `<p>Click the link below to verify your account:</p><a href="${verificationUrl}">Verify Email</a>`,
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

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error('Invalid email or password');

  const token = jwt.sign({ id: user._id, email: user.email }, secret, {
    expiresIn: '1d',
  });

  return { token };
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

module.exports = {
  registerUser,
  loginUser,
  verifyUserEmail,
};
