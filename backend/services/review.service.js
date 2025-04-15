const Review = require('../models/review.model');
const { generateTitle } = require('../utils/helpers');

async function createReview(userId, code, language, reviewResult) {
  const title = generateTitle(reviewResult);

  const review = await Review.create({
    user: userId,
    code,
    language,
    reviewResult,
    title,
  });

  return {
    _id: review._id,
    title: review.title,
    createdAt: review.createdAt,
  };
}

async function getReviewHistory(userId) {
  return Review.find({ user: userId })
    .select('_id title createdAt')
    .sort({ createdAt: -1 })
    .lean()
    .exec();
}

async function getReviewById(reviewId, userId) {
  return await Review.findOne({
    _id: reviewId,
    user: userId,
  })
    .lean()
    .exec();
}

module.exports = { createReview, getReviewHistory, getReviewById };
