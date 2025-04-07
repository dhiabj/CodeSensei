const express = require('express');
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
router.post('/check-token', isAuthorized, checkToken);

module.exports = router;
