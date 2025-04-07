const jwt = require('jsonwebtoken');

async function isAuthorized(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    console.error('Authorization error:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

module.exports = isAuthorized;
