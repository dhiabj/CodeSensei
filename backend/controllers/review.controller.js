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

module.exports = {
  getUserReviewHistory,
};
