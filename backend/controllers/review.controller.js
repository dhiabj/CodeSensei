const reviewService = require('../services/review.service');

async function getUserReviewHistory(req, res) {
  try {
    const userId = req.user.id;
    const reviews = await reviewService.getReviewHistory(userId);
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching review history:', error);
    res.status(500).json({ message: 'Failed to fetch review history' });
  }
}

async function getReview(req, res) {
  try {
    const reviewId = req.params.id;
    const userId = req.user.id;
    const review = await reviewService.getReviewById(reviewId, userId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ message: 'Failed to fetch review' });
  }
}

module.exports = {
  getUserReviewHistory,
  getReview,
};
