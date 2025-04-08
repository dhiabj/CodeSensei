const express = require('express');
const {
  getUserReviewHistory,
  getReview,
} = require('../controllers/review.controller');
const isAuthorized = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/history', isAuthorized, getUserReviewHistory);
router.get('/:id', isAuthorized, getReview);

module.exports = router;
