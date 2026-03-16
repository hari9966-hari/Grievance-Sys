const Complaint = require('../models/Complaint');

/**
 * Get Public System Statistics
 * GET /api/system/stats
 * @access Public
 */
exports.getPublicStats = async (req, res, next) => {
  try {
    const total = await Complaint.countDocuments();
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    const inProgress = await Complaint.countDocuments({ 
      status: { $in: ['Open', 'Verified', 'In Progress', 'Escalated'] } 
    });
    
    // Get stats by category for public chart
    const byCategory = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Get last 5 resolved complaints
    const recentResolutions = await Complaint.find({ status: 'Resolved' })
      .select('title category resolvedAt location')
      .sort({ resolvedAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        total,
        resolved,
        inProgress,
        resolutionRate: total > 0 ? ((resolved / total) * 100).toFixed(1) : 0,
        byCategory
      },
      recentResolutions
    });
  } catch (error) {
    next(error);
  }
};
