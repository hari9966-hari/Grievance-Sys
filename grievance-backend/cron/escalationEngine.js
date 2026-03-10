const cron = require('node-cron');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const SLARule = require('../models/SLARule');

/**
 * Start Escalation Cron Job
 * Runs every 5 minutes to check for overdue complaints
 * and escalate them automatically
 */
const startEscalationEngine = () => {
  // Run every 5 minutes
  const escalationCron = cron.schedule('*/5 * * * *', async () => {
    console.log(`[${new Date().toISOString()}] Running escalation check...`);
    
    try {
      await checkAndEscalateComplaints();
    } catch (error) {
      console.error('Error in escalation engine:', error);
    }
  });

  return escalationCron;
};

/**
 * Check all unresolved complaints and escalate if needed
 */
const checkAndEscalateComplaints = async () => {
  try {
    // Find all unresolved complaints past their deadline
    const now = new Date();
    
    const overdueComplaints = await Complaint.find({
      status: { $in: ['Open', 'Verified', 'In Progress'] },
      $or: [
        { slaDeadline: { $lt: now } },
        { stageDeadline: { $lt: now } }
      ]
    }).populate('assignedTo');

    console.log(`Found ${overdueComplaints.length} overdue complaints`);

    for (const complaint of overdueComplaints) {
      await escalateComplaint(complaint);
    }

  } catch (error) {
    console.error('Error checking complaints:', error);
  }
};

/**
 * Escalate a single complaint
 * @param {Object} complaint - Complaint document
 */
const escalateComplaint = async (complaint) => {
  try {
    const currentLevel = complaint.escalationLevel;
    const newLevel = Math.min(currentLevel + 1, 3); // Max level 3

    // Get SLA rule for this category
    const slaRule = await SLARule.findOne({ category: complaint.category });
    
    if (!slaRule) {
      console.warn(`No SLA rule found for category: ${complaint.category}`);
      return;
    }

    // Calculate new deadline based on escalation level
    let escalationHours = 24; // Default
    
    if (currentLevel === 0) {
      escalationHours = slaRule.escalationPolicy.level1to2 || 24;
    } else if (currentLevel === 1) {
      escalationHours = slaRule.escalationPolicy.level2to3 || 48;
    } else if (currentLevel === 2) {
      escalationHours = slaRule.escalationPolicy.level3toAdmin || 72;
    }

    const newDeadline = new Date(Date.now() + escalationHours * 60 * 60 * 1000);

    // Find next level officer
    const nextOfficer = await findOfficerForEscalation(
      complaint.category,
      newLevel,
      complaint.assignedTo?._id
    );

    // Log escalation history
    complaint.escalationHistory.push({
      timestamp: new Date(),
      fromLevel: currentLevel,
      toLevel: newLevel,
      reason: 'SLA Deadline Exceeded',
      assignedTo: nextOfficer?._id || null,
      newDeadline: newDeadline
    });

    // Update complaint
    complaint.escalationLevel = newLevel;
    complaint.slaDeadline = newDeadline;
    complaint.status = 'Escalated';
    
    if (newLevel === 3) {
      complaint.priority = 'Critical';
    } else if (newLevel === 2) {
      complaint.priority = 'High';
    }

    // Reassign to next level officer
    if (nextOfficer) {
      complaint.assignedTo = nextOfficer._id;
    }

    await complaint.save();

    console.log(`Escalated Complaint ${complaint._id} from Level ${currentLevel} to ${newLevel}`);
  } catch (error) {
    console.error(`Error escalating complaint ${complaint._id}:`, error);
  }
};

/**
 * Find appropriate officer for escalation
 * @param {String} category - Complaint category
 * @param {Number} authorityLevel - Required authority level
 * @param {String} currentOfficerId - Current officer ID (exclude from selection)
 * @returns {Object} Next officer to assign
 */
const findOfficerForEscalation = async (category, authorityLevel, currentOfficerId) => {
  try {
    // Find officers with required authority level in same department
    const officer = await User.findOne({
      role: 'officer',
      authorityLevel: { $gte: authorityLevel },
      _id: { $ne: currentOfficerId },
      isActive: true
    }).sort({ openComplaintCount: 1 }); // Load balance

    return officer;
  } catch (error) {
    console.error('Error finding next officer:', error);
    return null;
  }
};

/**
 * Recurring Issue Detection
 * Check if same category + location appears after resolution
 */
const checkRecurringIssues = async () => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    // Find resolved complaints in last 30 days
    const resolvedComplaints = await Complaint.find({
      status: 'Resolved',
      resolvedAt: { $gte: thirtyDaysAgo }
    });

    for (const resolved of resolvedComplaints) {
      // Find new complaints with same category and location
      const newComplaints = await Complaint.find({
        category: resolved.category,
        location: resolved.location,
        createdAt: { $gt: resolved.resolvedAt },
        status: { $ne: 'Closed' }
      });

      if (newComplaints.length > 0) {
        for (const newComplaint of newComplaints) {
          newComplaint.isRecurring = true;
          newComplaint.previousComplaintId = resolved._id;
          newComplaint.occurrenceCount = (resolved.occurrenceCount || 1) + 1;

          // Mark as high priority if occurs > 3 times
          if (newComplaint.occurrenceCount > 3) {
            newComplaint.priority = 'High';
          }

          await newComplaint.save();
        }
      }
    }

    console.log('Recurring issues check completed');
  } catch (error) {
    console.error('Error checking recurring issues:', error);
  }
};

module.exports = {
  startEscalationEngine,
  checkAndEscalateComplaints,
  escalateComplaint,
  findOfficerForEscalation,
  checkRecurringIssues
};
