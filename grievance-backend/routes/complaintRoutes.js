const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const multer = require('multer');
const { protect, authorize, verifyEmailRequired } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/errorHandler');
const {
  createComplaint,
  supportComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  getComplaintStats,
  markAsFake,
  verifyResolution,
  submitRating
} = require('../controllers/complaintController');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

/**
 * Create Complaint (Citizen/Officer)
 * POST /api/complaints
 */
router.post(
  '/',
  protect,
  upload.single('image'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('location').trim().notEmpty().withMessage('Location is required')
  ],
  handleValidationErrors,
  createComplaint
);

/**
 * Get Complaint Statistics
 * GET /api/complaints/stats/dashboard
 */
router.get('/stats/dashboard', protect, getComplaintStats);

/**
 * Support Existing Complaint
 * POST /api/complaints/:complaintId/support
 */
router.post('/:complaintId/support', protect, supportComplaint);

/**
 * Mark Complaint as Fake (Admin only)
 * POST /api/complaints/:id/mark-fake
 */
router.post('/:id/mark-fake', protect, authorize('admin'), markAsFake);

/**
 * Verify Resolution (Citizen)
 * POST /api/complaints/:id/verify
 */
router.post('/:id/verify', protect, authorize('citizen'), verifyResolution);

/**
 * Submit Rating (Citizen)
 * POST /api/complaints/:id/rate
 */
router.post('/:id/rate', protect, authorize('citizen'), submitRating);

/**
 * Get All Complaints
 * GET /api/complaints
 */
router.get('/', protect, getComplaints);

/**
 * Update Complaint Status (Officer/Admin)
 * PUT /api/complaints/:id
 */
router.put(
  '/:id',
  protect,
  authorize('officer', 'admin'),
  upload.single('resolutionProof'),
  [
    body('status').optional().isIn(['Open', 'Verified', 'In Progress', 'Resolved', 'Escalated', 'Closed']),
    body('resolutionNotes').optional().trim()
  ],
  handleValidationErrors,
  updateComplaintStatus
);

/**
 * Get Complaint by ID
 * GET /api/complaints/:id
 */
router.get('/:id', protect, getComplaintById);

module.exports = router;
