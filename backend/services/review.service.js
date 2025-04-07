const Review = require('../models/review.model');
const { generateTitle } = require('../utils/title.helper');

async function createReview(userId, code, reviewResult) {
  const title = generateTitle(reviewResult);

  return Review.create({
    user: userId,
    code,
    reviewResult,
    title,
  });
}

async function getReviewHistory(userId) {
  return Review.find({ user: userId })
    .select('_id title createdAt')
    .sort({ createdAt: -1 })
    .lean();
}

module.exports = { createReview, getReviewHistory };
