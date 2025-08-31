const jwt = require("jsonwebtoken");

exports.authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided.' });
    }

    const secret = process.env.JWT_SECRET;

    jwt.verify(token, secret, (err, user) => {
      if (err) {
        console.error("JWT verification error:", err);
        return res.status(403).json({ message: 'Invalid or expired token.' }); // ✅ send JSON!
      }
      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ message: 'Server error during authentication.' });
  }
};
