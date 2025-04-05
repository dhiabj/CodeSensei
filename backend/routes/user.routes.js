const express = require('express');
const {
  login,
  register,
  verifyEmail,
} = require('../controllers/user.controller');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/verify/:token', verifyEmail);

module.exports = router;
