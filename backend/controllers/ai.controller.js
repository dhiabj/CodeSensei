const { analyzeCode } = require('../services/ai.service');
const { createReview } = require('../services/review.service');

async function reviewUserCode(req, res) {
  try {
    const { code, language } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }
    const reviewResult = await analyzeCode(code, language);
    const newReview = await createReview(
      req.user.id,
      code,
      language,
      reviewResult
    );
    res.status(200).json(newReview);
  } catch (error) {
    console.error('Error in reviewCode:', error);
    return res
      .status(500)
      .json({ error: 'Failed to analyze and save code review' });
  }
}

async function reviewCode(req, res) {
  try {
    const { code, language } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }
    const reviewResult = await analyzeCode(code, language);
    res.status(200).json({ reviewResult });
  } catch (error) {
    console.error('Error in reviewCode:', error);
    return res
      .status(500)
      .json({ error: 'Failed to analyze and save code review' });
  }
}

module.exports = { reviewCode, reviewUserCode };
