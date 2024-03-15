const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, 'jwtSecret');

    req.lender = decoded.lender;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
