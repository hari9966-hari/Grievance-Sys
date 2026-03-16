const Complaint = require('../models/Complaint');
const User = require('../models/User');
const SLARule = require('../models/SLARule');
const { generateFileHash, calculateSimilarity } = require('../utils/hashUtils');
const { createAuditLog } = require('../middleware/audit');
const { createNotification } = require('./notificationController');
const { sendEmail, templates } = require('../services/emailService');

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
    let slaRule = await SLARule.findOne({ category });
    
    // Fallback if no specific rule found
    if (!slaRule) {
      console.warn(`No SLA rule found for category: ${category}. Using default fallback (72 hours).`);
      // Create a transient rule object for logic consistency
      slaRule = {
        timeLimitInHours: 72,
        priority: 'Medium',
        verifyWithinHours: 24
      };
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
      email: req.body.email,
      createdBy: userId,
      status: 'Open',
      slaDeadline,
      stageDeadline,
      escalationLevel: 0,
      image: imagePath,
      imageHash: imageHash,
      priority: slaRule.priority || 'Low',
      coordinates: req.body.lat && req.body.lng ? {
        lat: parseFloat(req.body.lat),
        lng: parseFloat(req.body.lng)
      } : null
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

    // Send confirmation email
    const notificationEmail = complaint.email || user.email;
    if (notificationEmail) {
      sendEmail({
        email: notificationEmail,
        ...templates.COMPLAINT_CREATED(complaint)
      }).catch(err => console.error('Error sending creation email:', err));
    }

    console.log(`Complaint Created Successfully: ${complaint._id} by ${userId}`);

    res.status(201).json({
      success: true,
      message: 'Complaint created successfully',
      complaint
    });

    // Notify appropriate officers (level 1 in the same department)
    try {
      const officers = await User.find({ 
        role: 'officer', 
        department: category,
        authorityLevel: 1
      });

      for (const officer of officers) {
        await createNotification({
          recipient: officer._id,
          type: 'complaint_created',
          title: 'New Complaint Filed',
          message: `A new complaint has been filed in your department (${category}): ${title}`,
          complaintId: complaint._id
        });
      }
    } catch (notifErr) {
      console.error('Failed to send creation notification:', notifErr);
    }
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

    // Notify creator about support
    try {
      await createNotification({
        recipient: complaint.createdBy,
        type: 'message_received',
        title: 'Complaint Supported',
        message: `Your complaint "${complaint.title}" has received a new supporter. Total supports: ${complaint.duplicateCount}`,
        complaintId: complaint._id
      });
    } catch (notifErr) {
      console.error('Failed to send support notification:', notifErr);
    }
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
    const { 
      status, category, priority, location, 
      search, dateFrom, dateTo,
      onlyMine, page = 1, limit = 10 
    } = req.query;
    
    const skip = (page - 1) * limit;

    let filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (location) filter.location = { $regex: location, $options: 'i' };
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    if (onlyMine === 'true') {
      filter.createdBy = req.user._id;
    }

    const complaints = await Complaint.find(filter)
      .populate('createdBy', 'name email trustScore')
      .populate('assignedTo', 'name email department')
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
      
      // NEW: Set verification status to Pending
      complaint.verificationStatus = 'Pending';
      
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

    // Notify citizen about status update
    try {
      await createNotification({
        recipient: complaint.createdBy,
        type: 'complaint_status_updated',
        title: 'Complaint Status Updated',
        message: `The status of your complaint "${complaint.title}" has been updated to ${status}.`,
        complaintId: complaint._id,
        data: { status }
      });

      // If assigned to a new officer, notify them
      if (status === 'Verified' || (before.assignedTo?.toString() !== complaint.assignedTo?.toString())) {
        if (complaint.assignedTo) {
          await createNotification({
            recipient: complaint.assignedTo,
            type: 'complaint_status_updated',
            title: 'Complaint Assigned',
            message: `A complaint has been assigned to you: ${complaint.title}`,
            complaintId: complaint._id
          });
        }
      }
    } catch (notifErr) {
      console.error('Failed to send status update notification:', notifErr);
    }

    // Send Email notification for resolution
    if (status === 'Resolved') {
      try {
        const citizen = await User.findById(complaint.createdBy);
        await sendEmail({
          email: citizen.email,
          ...templates.RESOLUTION_VERIFICATION(complaint)
        });
      } catch (emailErr) {
        console.error('Failed to send resolution email:', emailErr);
      }
    }

  } catch (error) {
    next(error);
  }
};

/**
 * Verify Resolution (Citizen only)
 * POST /api/complaints/:id/verify
 */
exports.verifyResolution = async (req, res, next) => {
  try {
    const { action, feedback } = req.body; // 'Confirm' or 'Reopen'
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (complaint.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const before = complaint.toObject();

    if (action === 'Confirm') {
      complaint.status = 'Closed';
      complaint.verificationStatus = 'Confirmed';
      complaint.verificationAt = new Date();
    } else if (action === 'Reopen') {
      complaint.status = 'In Progress';
      complaint.verificationStatus = 'Reopened';
      complaint.feedback = feedback;
      
      // Notify assigned officer
      if (complaint.assignedTo) {
        await createNotification({
          recipient: complaint.assignedTo,
          type: 'complaint_status_updated',
          title: 'Complaint Reopened',
          message: `The citizen has reopened complaint: ${complaint.title}`,
          complaintId: complaint._id
        });

        // Send Email to officer
        try {
          const officer = await User.findById(complaint.assignedTo);
          await sendEmail({
            email: officer.email,
            ...templates.COMPLAINT_REOPENED(complaint)
          });
        } catch (emailErr) {
          console.error('Failed to send reopen email:', emailErr);
        }
      }
    }

    await complaint.save();

    await createAuditLog({
      req,
      action: action === 'Confirm' ? 'VERIFY_RESOLUTION' : 'REOPEN_COMPLAINT',
      entityType: 'Complaint',
      entityId: complaint._id,
      before,
      after: complaint
    });

    res.status(200).json({
      success: true,
      message: action === 'Confirm' ? 'Resolution confirmed' : 'Complaint reopened',
      complaint
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit Rating (Citizen only)
 * POST /api/complaints/:id/rate
 */
exports.submitRating = async (req, res, next) => {
  try {
    const { rating, feedback } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (complaint.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    complaint.rating = rating;
    if (feedback) complaint.feedback = feedback;

    await complaint.save();

    res.status(200).json({
      success: true,
      message: 'Rating submitted successfully',
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

    let averageRating = null;
    if (req.user.role === 'officer') {
      const ratingStats = await Complaint.aggregate([
        { $match: { assignedTo: userId, rating: { $ne: null } } },
        { $group: { _id: null, avg: { $avg: '$rating' } } }
      ]);
      averageRating = ratingStats.length > 0 ? ratingStats[0].avg.toFixed(1) : "0.0";
    }

    res.status(200).json({
      success: true,
      stats: {
        total,
        resolved,
        pending,
        escalated,
        byCategory,
        averageRating
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
