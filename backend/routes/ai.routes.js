const express = require('express');
const { reviewCode } = require('../controllers/ai.controller');

const router = express.Router();

router.post('/review-code', reviewCode);

module.exports = router;
