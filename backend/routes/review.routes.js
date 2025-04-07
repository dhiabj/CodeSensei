const express = require('express');
const { getUserReviewHistory } = require('../controllers/review.controller');
const isAuthorized = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/history', isAuthorized, getUserReviewHistory);

module.exports = router;
