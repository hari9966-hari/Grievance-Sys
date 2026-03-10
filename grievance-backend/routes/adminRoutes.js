const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/errorHandler');
const {
  createOfficer,
  getOfficers,
  updateOfficer,
  deleteOfficer,
  createOrUpdateSLARule,
  getSLARules,
  reassignComplaint,
  forceCloseComplaint,
  getAnalytics,
  penalizeUser,
  getEscalationReport
} = require('../controllers/adminController');

/**
 * All admin routes require admin authorization
 */
router.use(protect, authorize('admin'));

/**
 * Officer Management
 */

// Create Officer
router.post(
  '/officers',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('department').notEmpty().withMessage('Department is required'),
    body('authorityLevel').isIn([1, 2, 3]).withMessage('Invalid authority level')
  ],
  handleValidationErrors,
  createOfficer
);

// Get All Officers
router.get('/officers', getOfficers);

// Update Officer
router.put(
  '/officers/:id',
  [
    body('name').optional().trim().notEmpty(),
    body('email').optional().isEmail(),
    body('authorityLevel').optional().isIn([1, 2, 3])
  ],
  handleValidationErrors,
  updateOfficer
);

// Delete Officer
router.delete('/officers/:id', deleteOfficer);

/**
 * SLA Rule Management
 */

// Create/Update SLA Rule
router.post(
  '/sla-rules',
  [
    body('category').notEmpty().withMessage('Category is required'),
    body('timeLimitInHours').isInt({ min: 1 }).withMessage('Time limit must be positive'),
    body('department').notEmpty().withMessage('Department is required')
  ],
  handleValidationErrors,
  createOrUpdateSLARule
);

// Get All SLA Rules
router.get('/sla-rules', getSLARules);

/**
 * Complaint Management
 */

// Reassign Complaint
router.put(
  '/complaints/:id/reassign',
  [
    body('assignToOfficerId').notEmpty().withMessage('Officer ID is required')
  ],
  handleValidationErrors,
  reassignComplaint
);

// Force Close Complaint
router.put(
  '/complaints/:id/force-close',
  [
    body('reason').optional().trim()
  ],
  handleValidationErrors,
  forceCloseComplaint
);

/**
 * Analytics & Reports
 */

// Get Analytics Dashboard
router.get('/analytics', getAnalytics);

// Get Escalation Report
router.get('/escalation-report', getEscalationReport);

/**
 * User Management
 */

// Penalize User
router.post(
  '/users/:id/penalize',
  [
    body('penalty').isInt({ min: 1 }).withMessage('Penalty must be positive'),
    body('reason').notEmpty().withMessage('Reason is required')
  ],
  handleValidationErrors,
  penalizeUser
);

module.exports = router;
