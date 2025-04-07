const express = require('express');
const { reviewCode } = require('../controllers/ai.controller');
const isAuthorized = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/review-code', isAuthorized, reviewCode);

module.exports = router;
