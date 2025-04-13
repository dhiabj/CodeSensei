const jwt = require('jsonwebtoken');
const crypto = require('crypto');

function generateTitle(analysis) {
  try {
    const issuesSection = analysis.split('🔍 Issues')[1] || analysis;
    const firstIssue = issuesSection
      .split('\n')
      .find((line) => line.trim().match(/^[-*]/));

    if (!firstIssue) return 'Code Review Analysis';

    return firstIssue
      .replace(/^[-*]\s*/, '')
      .split(/[,.:]/)[0]
      .trim()
      .split(' ')
      .slice(0, 3)
      .join(' ');
  } catch {
    return 'Code Review Analysis';
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
