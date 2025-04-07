const { analyzeCode } = require('../services/ai.service');

async function reviewCode(req, res) {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }
    const review = await analyzeCode(code);
    res.status(200).send(review);
  } catch (error) {
    console.error('Error in reviewCode:', error);
    return res.status(500).json({ error: 'Failed to analyze code' });
  }
}

module.exports = { reviewCode };
