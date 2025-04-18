const express = require('express');
const { reviewCode, reviewUserCode } = require('../controllers/ai.controller');
const isAuthorized = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/user/review-code', isAuthorized, reviewUserCode);
router.post('/review-code', reviewCode);

module.exports = router;
