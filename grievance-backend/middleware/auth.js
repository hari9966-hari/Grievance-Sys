const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware: Verify JWT Token and Attach User to Request
 */
const protect = async (req, res, next) => {
  let token;

  // Get token from headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Ensure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

/**
 * Middleware: Authorize User Role
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};

/**
 * Middleware: Check Authority Level
 * Higher authority levels can view/manage complaints of lower levels
 */
const checkAuthorityLevel = (minLevel) => {
  return (req, res, next) => {
    if (req.user.authorityLevel < minLevel) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient authority level'
      });
    }
    next();
  };
};

/**
 * Middleware: Verify Email
 */
const verifyEmailRequired = (req, res, next) => {
  if (!req.user.emailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required before creating complaints'
    });
  }
  next();
};

module.exports = {
  protect,
  authorize,
  checkAuthorityLevel,
  verifyEmailRequired
};
