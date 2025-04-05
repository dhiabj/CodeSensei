let User = require('../models/user.model');
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

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ status: 'error', error: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        status: 'error',
        error: 'Please verify your email before logging in',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ status: 'error', error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      secret,
      { expiresIn: '1d' }
    );

    res.json({ status: 'ok', token });
  } catch (err) {
    res.status(500).json({ status: 'error', error: 'Internal server error' });
  }
}

async function register(req, res) {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = jwt.sign({ email }, secret, {
      expiresIn: '1d',
    });

    const user = new User({
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // Expires in 1 day
    });

    await user.save();

    const verificationUrl = `${process.env.BASE_URL}/api/user/verify/${verificationToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email',
      html: `<p>Click the link below to verify your account:</p><a href="${verificationUrl}">Verify Email</a>`,
    });

    res.json({
      message:
        'Registration successful! Check your email to verify your account.',
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function verifyEmail(req, res) {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      email: decoded.email,
      verificationToken: token,
    });
    if (!user)
      return res.status(400).json({ error: 'Invalid or expired token' });

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    res.json({ message: 'Email verified successfully! You can now log in.' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid or expired token' });
  }
}

module.exports = {
  login,
  register,
  verifyEmail,
};
