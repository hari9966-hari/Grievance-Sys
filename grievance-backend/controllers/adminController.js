const User = require('../models/User');
const Complaint = require('../models/Complaint');
const SLARule = require('../models/SLARule');
const { createAuditLog } = require('../middleware/audit');

/**
 * Create Officer (Admin Only)
 * POST /api/admin/officers
 */
exports.createOfficer = async (req, res, next) => {
  try {
    const { name, email, password, department, authorityLevel } = req.body;

    // Validate input
    if (!name || !email || !password || !department || authorityLevel === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Create officer
    const officer = await User.create({
      name,
      email,
      password,
      role: 'officer',
      department,
      authorityLevel,
      emailVerified: true, // Admins verify officers
      trustScore: 100
    });

    await createAuditLog({
      req,
      action: 'CREATE_OFFICER',
      entityType: 'User',
      entityId: officer._id,
      before: null,
      after: {
        name: officer.name,
        email: officer.email,
        department: officer.department,
        authorityLevel: officer.authorityLevel
      }
    });

    res.status(201).json({
      success: true,
      message: 'Officer created successfully',
      officer: {
        _id: officer._id,
        name: officer.name,
        email: officer.email,
        department: officer.department,
        authorityLevel: officer.authorityLevel
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Officers
 * GET /api/admin/officers
 */
exports.getOfficers = async (req, res, next) => {
  try {
    const officers = await User.find({ role: 'officer' })
      .select('-password')
      .sort({ authorityLevel: -1 });

    res.status(200).json({
      success: true,
      total: officers.length,
      officers
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Officer
 * PUT /api/admin/officers/:id
 */
exports.updateOfficer = async (req, res, next) => {
  try {
    const { name, email, department, authorityLevel, isActive } = req.body;

    const before = await User.findById(req.params.id).select('-password');

    const officer = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, department, authorityLevel, isActive },
      { new: true, runValidators: true }
    ).select('-password');

    await createAuditLog({
      req,
      action: 'UPDATE_OFFICER',
      entityType: 'User',
      entityId: officer?._id,
      before,
      after: officer
    });

    res.status(200).json({
      success: true,
      message: 'Officer updated successfully',
      officer
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Officer
 * DELETE /api/admin/officers/:id
 */
exports.deleteOfficer = async (req, res, next) => {
  try {
    const before = await User.findById(req.params.id).select('-password');
    await User.findByIdAndDelete(req.params.id);

    await createAuditLog({
      req,
      action: 'DELETE_OFFICER',
      entityType: 'User',
      entityId: before?._id,
      before,
      after: null
    });

    res.status(200).json({
      success: true,
      message: 'Officer deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create or Update SLA Rule
 * POST /api/admin/sla-rules
 * PUT /api/admin/sla-rules/:id
 */
exports.createOrUpdateSLARule = async (req, res, next) => {
  try {
    const { category, timeLimitInHours, department, escalationPolicy, priority } = req.body;

    let slaRule = await SLARule.findOne({ category });

    if (slaRule) {
      // Update existing
      const before = slaRule.toObject();

      slaRule.timeLimitInHours = timeLimitInHours;
      slaRule.department = department;
      slaRule.escalationPolicy = escalationPolicy;
      slaRule.priority = priority;
      await slaRule.save();

      await createAuditLog({
        req,
        action: 'UPDATE_SLA_RULE',
        entityType: 'SLARule',
        entityId: slaRule._id,
        before,
        after: slaRule
      });

      return res.status(200).json({
        success: true,
        message: 'SLA rule updated',
        slaRule
      });
    }

    // Create new
    slaRule = await SLARule.create({
      category,
      timeLimitInHours,
      department,
      escalationPolicy: escalationPolicy || {},
      priority: priority || 'Medium'
    });

    await createAuditLog({
      req,
      action: 'CREATE_SLA_RULE',
      entityType: 'SLARule',
      entityId: slaRule._id,
      before: null,
      after: slaRule
    });

    res.status(201).json({
      success: true,
      message: 'SLA rule created',
      slaRule
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get All SLA Rules
 * GET /api/admin/sla-rules
 */
exports.getSLARules = async (req, res, next) => {
  try {
    const rules = await SLARule.find().sort({ category: 1 });

    res.status(200).json({
      success: true,
      total: rules.length,
      rules
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reassign Complaint
 * PUT /api/admin/complaints/:id/reassign
 */
exports.reassignComplaint = async (req, res, next) => {
  try {
    const { assignToOfficerId } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    const officer = await User.findById(assignToOfficerId);
    if (!officer || officer.role !== 'officer') {
      return res.status(404).json({
        success: false,
        message: 'Officer not found'
      });
    }

    // Update assignment
    const previousOfficer = complaint.assignedTo;
    const before = complaint.toObject();

    complaint.assignedTo = assignToOfficerId;
    complaint.status = 'Verified'; // Reset status after reassignment
    await complaint.save();

    // Update officer workload
    if (previousOfficer) {
      await User.findByIdAndUpdate(previousOfficer, {
        $inc: { openComplaintCount: -1 }
      });
    }
    
    await User.findByIdAndUpdate(assignToOfficerId, {
      $inc: { openComplaintCount: 1 }
    });

    await createAuditLog({
      req,
      action: 'REASSIGN_COMPLAINT',
      entityType: 'Complaint',
      entityId: complaint._id,
      before,
      after: complaint
    });

    res.status(200).json({
      success: true,
      message: 'Complaint reassigned successfully',
      complaint
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Force Close Complaint
 * PUT /api/admin/complaints/:id/force-close
 */
exports.forceCloseComplaint = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    const before = complaint.toObject();

    complaint.status = 'Closed';
    complaint.resolutionNotes = reason || 'Force closed by admin';
    complaint.closedAt = new Date();
    await complaint.save();

    // Update user stats
    if (complaint.status !== 'Resolved') {
      await User.findByIdAndUpdate(complaint.createdBy, {
        $inc: { openComplaintCount: -1 }
      });
    }

    await createAuditLog({
      req,
      action: 'FORCE_CLOSE_COMPLAINT',
      entityType: 'Complaint',
      entityId: complaint._id,
      before,
      after: complaint
    });

    res.status(200).json({
      success: true,
      message: 'Complaint force closed',
      complaint
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Analytics Dashboard
 * GET /api/admin/analytics
 */
exports.getAnalytics = async (req, res, next) => {
  try {
    // Total complaints
    const totalComplaints = await Complaint.countDocuments();
    console.log(`Analytics Debug: totalComplaints = ${totalComplaints}`);
    
    const resolvedComplaints = await Complaint.countDocuments({ status: 'Resolved' });
    const escalatedComplaints = await Complaint.countDocuments({ status: 'Escalated' });
    const averageResolutionTime = await calculateAverageResolutionTime();

    // Department performance
    const departmentStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] }
          },
          escalated: {
            $sum: { $cond: [{ $eq: ['$status', 'Escalated'] }, 1, 0] }
          }
        }
      }
    ]);
    console.log(`Analytics Debug: departmentStats length = ${departmentStats.length}`);

    // Officer performance
    const officerStats = await User.aggregate([
      { $match: { role: 'officer' } },
      {
        $project: {
          name: 1,
          department: 1,
          openComplaintCount: 1,
          resolvedComplaintCount: 1,
          performanceScore: {
            $cond: [
              { $eq: ['$resolvedComplaintCount', 0] },
              0,
              {
                $divide: [
                  '$resolvedComplaintCount',
                  { $add: ['$resolvedComplaintCount', '$openComplaintCount'] }
                ]
              }
            ]
          }
        }
      }
    ]);

    // Detailed status counts for pie chart
    const openComplaints = await Complaint.countDocuments({ status: 'Open' });
    const inProgressComplaints = await Complaint.countDocuments({ status: 'In Progress' });
    const verifiedComplaints = await Complaint.countDocuments({ status: 'Verified' });
    // "Pending" is used by frontend and maps to Open + In Progress + Verified
    const pendingComplaints = openComplaints + inProgressComplaints + verifiedComplaints;

    // User counts
    const totalUsers = await User.countDocuments();
    const totalOfficers = await User.countDocuments({ role: 'officer' });
    const activeCitizens = await User.countDocuments({ role: 'citizen', isActive: true });

    // Recurring issues
    const recurringIssues = await Complaint.countDocuments({ isRecurring: true });

    res.status(200).json({
      success: true,
      analytics: {
        totalComplaints,
        resolvedComplaints,
        escalatedComplaints,
        openComplaints,
        inProgressComplaints,
        verifiedComplaints,
        pendingComplaints,
        totalUsers,
        totalOfficers,
        activeCitizens,
        resolutionRate: totalComplaints > 0 ? ((resolvedComplaints / totalComplaints) * 100).toFixed(2) : "0.00",
        averageResolutionTime,
        departmentStats,
        officerStats,
        recurringIssues
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper: Calculate average resolution time
 */
const calculateAverageResolutionTime = async () => {
  try {
    const result = await Complaint.aggregate([
      { $match: { status: 'Resolved', resolvedAt: { $exists: true } } },
      {
        $group: {
          _id: null,
          avgTime: {
            $avg: {
              $subtract: ['$resolvedAt', '$createdAt']
            }
          }
        }
      }
    ]);

    if (result.length === 0) return 0;
    return Math.round(result[0].avgTime / (1000 * 60 * 60)); // Convert to hours
  } catch (error) {
    return 0;
  }
};

/**
 * Penalize User Trust Score
 * POST /api/admin/users/:id/penalize
 */
exports.penalizeUser = async (req, res, next) => {
  try {
    const { penalty, reason } = req.body;

    const before = await User.findById(req.params.id);

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { trustScore: -Math.abs(penalty) }
      },
      { new: true }
    );

    await createAuditLog({
      req,
      action: 'PENALIZE_USER',
      entityType: 'User',
      entityId: user?._id,
      before,
      after: user
    });

    res.status(200).json({
      success: true,
      message: `User penalized by ${penalty} points. Reason: ${reason}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        trustScore: user.trustScore
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Escalation Report
 * GET /api/admin/escalation-report
 */
exports.getEscalationReport = async (req, res, next) => {
  try {
    const escalatedComplaints = await Complaint.find({
      status: 'Escalated'
    })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email department')
      .sort({ slaDeadline: 1 });

    const escalationStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$escalationLevel',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      escalationStats,
      escalatedComplaints
    });
  } catch (error) {
    next(error);
  }
};
