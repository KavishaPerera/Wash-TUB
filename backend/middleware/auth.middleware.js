const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.config');

const authMiddleware = {
  // Verify JWT token
  verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, jwtConfig.secret);
      req.userId = decoded.id;
      req.userEmail = decoded.email;
      req.userRole = decoded.role;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  },

  // Check if user is admin
  isAdmin(req, res, next) {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  },

  // Check if user is staff or admin
  isStaff(req, res, next) {
    if (req.userRole !== 'staff' && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Staff access required' });
    }
    next();
  },

  // Check if user is delivery personnel
  isDelivery(req, res, next) {
    if (req.userRole !== 'delivery' && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Delivery access required' });
    }
    next();
  }
};

module.exports = authMiddleware;
