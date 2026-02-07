const { verifyToken } = require('../utils/jwt');

const authenticateToken = (req, res, next) => {
  const authHeader = req.header('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is required.' });
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return res.status(500).json({ message: 'JWT secret is not configured on server.' });
  }

  try {
    const payload = verifyToken(token, jwtSecret);
    req.user = payload;
    return next();
  } catch (_error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authenticateToken;
