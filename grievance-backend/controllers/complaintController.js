const Complaint = require('../models/Complaint');
const User = require('../models/User');
const SLARule = require('../models/SLARule');
const { generateFileHash, calculateSimilarity } = require('../utils/hashUtils');
const { createAuditLog } = require('../middleware/audit');

/**
 * Create Complaint
 * POST /api/complaints
 * Includes duplicate detection logic
 */
exports.createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, location } = req.body;
    const userId = req.user._id;

    // Check trust score - low trust users cannot create complaints without approval
    const user = await User.findById(userId);
    
    if (user.trustScore < parseInt(process.env.MIN_TRUST_SCORE_FOR_COMPLAINTS || 0)) {
      return res.status(403).json({
        success: false,
        message: 'Low trust score. Complaint requires admin approval.'
      });
    }

    // Check open complaint limit
    const openCount = user.openComplaintCount || 0;
    const maxOpenComplaints = parseInt(process.env.MAX_OPEN_COMPLAINTS_PER_USER || 3);
    
    if (openCount >= maxOpenComplaints) {
      return res.status(400).json({
        success: false,
        message: `Maximum ${maxOpenComplaints} open complaints allowed per user`
      });
    }

    // Check for duplicate/similar complaints
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const similarComplaints = await Complaint.find({
      category,
      location,
      createdAt: { $gte: sevenDaysAgo },
      status: { $ne: 'Closed' }
    });

    // Find highly similar complaints (> 70% similarity)
    let duplicateFound = null;
    for (const complaint of similarComplaints) {
      const similarity = calculateSimilarity(title + ' ' + description, 
                                             complaint.title + ' ' + complaint.description);
      
      if (similarity > 70) {
        duplicateFound = complaint;
        
        return res.status(400).json({
          success: false,
          message: 'A similar complaint already exists in this location',
          duplicateComplaintId: complaint._id,
          duplicateComplaintTitle: complaint.title,
          duplicateComplaintStatus: complaint.status,
          suggestion: 'You can support the existing complaint instead of creating a duplicate'
        });
      }
    }

    // Get SLA deadline
    const slaRule = await SLARule.findOne({ category });
    if (!slaRule) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category selected'
      });
    }

    const slaDeadline = new Date(Date.now() + slaRule.timeLimitInHours * 60 * 60 * 1000);
    let stageDeadline = null;

    if (slaRule.verifyWithinHours) {
      stageDeadline = new Date(Date.now() + slaRule.verifyWithinHours * 60 * 60 * 1000);
    }

    // Handle image upload
    let imageHash = null;
    let imagePath = null;

    if (req.file) {
      imagePath = req.file.path;
      imageHash = generateFileHash(req.file.buffer);

      // Check if same image was uploaded before (recurring/fake indication)
      const previousImageUse = await Complaint.findOne({ imageHash });
      if (previousImageUse) {
        console.log(`Image hash match found for complaint: ${previousImageUse._id}`);
      }
    }

    // Create complaint
    const complaint = await Complaint.create({
      title,
      description,
      category,
      location,
      createdBy: userId,
      status: 'Open',
      slaDeadline,
      stageDeadline,
      escalationLevel: 0,
      image: imagePath,
      imageHash: imageHash,
      priority: slaRule.priority || 'Low'
    });

    // Update user open complaint count
    await User.findByIdAndUpdate(userId, {
      $inc: { openComplaintCount: 1 }
    });

    // Increment trust score for valid complaint
    await User.findByIdAndUpdate(userId, {
      $inc: { trustScore: parseInt(process.env.VALID_COMPLAINT_BONUS || 5) }
    });

    await createAuditLog({
      req,
      action: 'CREATE_COMPLAINT',
      entityType: 'Complaint',
      entityId: complaint._id,
      before: null,
      after: complaint
    });

    res.status(201).json({
      success: true,
      message: 'Complaint created successfully',
      complaint
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Support Existing Complaint
 * POST /api/complaints/:complaintId/support
 * Instead of creating duplicate, support existing
 */
exports.supportComplaint = async (req, res, next) => {
  try {
    const { complaintId } = req.params;
    const userId = req.user._id;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Check if user already supported
    const alreadySupported = complaint.supporters.some(
      (s) => s.userId.toString() === userId.toString()
    );

    if (alreadySupported) {
      return res.status(400).json({
        success: false,
        message: 'You have already supported this complaint'
      });
    }

    // Add supporter
    complaint.supporters.push({
      userId,
      supportedAt: new Date()
    });

    // Increment duplicate count
    complaint.duplicateCount += 1;

    const before = complaint.toObject();
    await complaint.save();

    await createAuditLog({
      req,
      action: 'SUPPORT_COMPLAINT',
      entityType: 'Complaint',
      entityId: complaint._id,
      before,
      after: complaint
    });

    // Increase trust score
    await User.findByIdAndUpdate(userId, {
      $inc: { trustScore: parseInt(process.env.VALID_COMPLAINT_BONUS || 5) }
    });

    res.status(200).json({
      success: true,
      message: 'Successfully supported complaint',
      complaint
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Complaints (with filters)
 * GET /api/complaints
 */
exports.getComplaints = async (req, res, next) => {
  try {
    const { status, category, priority, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    // Citizens can now see all complaints (for transparency).
    // If you want "only mine", add a query flag and filter here.

    const complaints = await Complaint.find(filter)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Complaint.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      complaints
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Complaint by ID
 * GET /api/complaints/:id
 */
exports.getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('createdBy', 'name email trustScore')
      .populate('assignedTo', 'name email department')
      .populate('resolvedBy', 'name email')
      .populate('escalationHistory.assignedTo', 'name email');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Check authorization
    if (req.user.role === 'citizen' && complaint.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this complaint'
      });
    }

    res.status(200).json({
      success: true,
      complaint
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Complaint Status (Officer/Admin only)
 * PUT /api/complaints/:id
 */
exports.updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, resolutionNotes, resolutionProof } = req.body;
    const complaintId = req.params.id;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Check authorization - only assigned officer or admin can update
    if (req.user.role === 'officer' && !complaint.assignedTo) {
      // If complaint is not assigned yet, allow any officer to update it
      complaint.assignedTo = req.user._id;
    } else if (req.user.role !== 'admin' && 
        complaint.assignedTo?.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this complaint'
      });
    }

    // Validate status flow
    const validStatuses = ['Open', 'Verified', 'In Progress', 'Resolved', 'Escalated', 'Closed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const before = complaint.toObject();

    // Update fields
    if (status) complaint.status = status;
    if (resolutionNotes) complaint.resolutionNotes = resolutionNotes;
    
    // Handle resolution
    if (status === 'Resolved') {
      complaint.resolvedAt = new Date();
      complaint.resolvedBy = req.user._id;
      
      if (resolutionProof) {
        complaint.resolutionProof = resolutionProof;
        complaint.resolutionProofHash = generateFileHash(Buffer.from(resolutionProof));
      }

      // Update user stats
      await User.findByIdAndUpdate(complaint.createdBy, {
        $inc: { 
          resolvedComplaintCount: 1,
          openComplaintCount: -1
        }
      });

      // Increase resolver trust score
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { trustScore: 10 }
      });
    }

    if (status === 'Verified') {
      complaint.status = 'Verified';
    }

    await complaint.save();

    await createAuditLog({
      req,
      action: 'UPDATE_COMPLAINT_STATUS',
      entityType: 'Complaint',
      entityId: complaint._id,
      before,
      after: complaint
    });

    res.status(200).json({
      success: true,
      message: 'Complaint updated successfully',
      complaint
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Complaint Statistics
 * GET /api/complaints/stats/dashboard
 */
exports.getComplaintStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let query = {};

    if (req.user.role === 'citizen') {
      query = { createdBy: userId };
    } else if (req.user.role === 'officer') {
      query = { assignedTo: userId };
    }

    const total = await Complaint.countDocuments(query);
    const resolved = await Complaint.countDocuments({ ...query, status: 'Resolved' });
    const pending = await Complaint.countDocuments({ 
      ...query, 
      status: { $in: ['Open', 'Verified', 'In Progress'] } 
    });
    const escalated = await Complaint.countDocuments({ ...query, status: 'Escalated' });

    const byCategory = await Complaint.aggregate([
      { $match: query },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total,
        resolved,
        pending,
        escalated,
        byCategory
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark Complaint as Fake
 * POST /api/complaints/:id/mark-fake
 * (Admin only - penalizes user)
 */
exports.markAsFake = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    const before = complaint.toObject();

    complaint.isFake = true;
    complaint.fakeReportCount += 1;
    await complaint.save();

    // Penalize user trust score
    await User.findByIdAndUpdate(complaint.createdBy, {
      $inc: { 
        trustScore: parseInt(process.env.FAKE_COMPLAINT_PENALTY || -20)
      }
    });

    await createAuditLog({
      req,
      action: 'MARK_COMPLAINT_FAKE',
      entityType: 'Complaint',
      entityId: complaint._id,
      before,
      after: complaint
    });

    res.status(200).json({
      success: true,
      message: 'Complaint marked as fake',
      complaint
    });
  } catch (error) {
    next(error);
  }
};
