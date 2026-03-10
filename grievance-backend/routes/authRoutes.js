const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/errorHandler');
const {
  register,
  login,
  getMe,
  updateProfile,
  verifyEmail,
  getUserStats
} = require('../controllers/authController');

/**
 * Public Routes
 */

// Register User
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['citizen', 'officer']).withMessage('Invalid role')
  ],
  handleValidationErrors,
  register
);

// Login User
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  handleValidationErrors,
  login
);

/**
 * Protected Routes
 */

// Get Current User
router.get('/me', protect, getMe);

// Update Profile
router.put(
  '/update-profile',
  protect,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required')
  ],
  handleValidationErrors,
  updateProfile
);

// Verify Email
router.post('/verify-email', protect, verifyEmail);

// Get User Statistics
router.get('/stats', protect, getUserStats);

module.exports = router;
