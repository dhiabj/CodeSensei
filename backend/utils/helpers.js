const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const DEFAULT_TITLE = 'Code Review Analysis';
const ISSUES_HEADER = '🔍 Issues';

function generateTitle(analysis) {
  if (typeof analysis !== 'string' || !analysis.trim()) {
    return DEFAULT_TITLE;
  }

  try {
    const issuesSection = analysis.split(ISSUES_HEADER)[1] || analysis;
    const firstIssueLine = issuesSection
      .split('\n')
      .find((line) => line.trim().match(/^[-*]\s/));

    if (!firstIssueLine) return DEFAULT_TITLE;

    const issueText = firstIssueLine
      .replace(/^[-*]\s*/, '')
      .split(/[,.:]/)[0]
      .trim();

    const meaningfulWords = issueText
      .split(' ')
      .filter((word) => word.length > 3)
      .slice(0, 4);

    return meaningfulWords.join(' ') || DEFAULT_TITLE;
  } catch (error) {
    console.error('Title generation failed:', error);
    return DEFAULT_TITLE;
  }
}

function generateAccessToken(id) {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
}

function generateRefreshToken(id) {
  const jti = crypto.randomBytes(64).toString('hex');
  const refreshToken = jwt.sign({ id, jti }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
  return { refreshToken, jti };
}

module.exports = { generateTitle, generateAccessToken, generateRefreshToken };
