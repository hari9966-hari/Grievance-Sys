const cron = require('node-cron');
const Complaint = require('../models/Complaint');
const AnalyticsSnapshot = require('../models/AnalyticsSnapshot');

const startDailyAnalyticsJob = () => {
  // Run once per day at 01:00
  cron.schedule('0 1 * * *', async () => {
    const today = new Date();
    const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    try {
      const totals = await Complaint.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const totalsByStatus = {};
      totals.forEach((t) => {
        totalsByStatus[t._id] = t.count;
      });

      const slaBreaches = await Complaint.countDocuments({
        status: { $in: ['Escalated'] }
      });

      const escalationCounts = await Complaint.aggregate([
        {
          $group: {
            _id: '$escalationLevel',
            count: { $sum: 1 }
          }
        }
      ]);

      const escalationCountByLevel = {};
      escalationCounts.forEach((e) => {
        escalationCountByLevel[e._id] = e.count;
      });

      const recurringIssuesCount = await Complaint.countDocuments({ isRecurring: true });

      const avgResolutionAgg = await Complaint.aggregate([
        { $match: { status: 'Resolved', resolvedAt: { $exists: true } } },
        {
          $group: {
            _id: null,
            avgTime: { $avg: { $subtract: ['$resolvedAt', '$createdAt'] } }
          }
        }
      ]);

      const avgResolutionTimeHours =
        avgResolutionAgg.length > 0
          ? Math.round(avgResolutionAgg[0].avgTime / (1000 * 60 * 60))
          : 0;

      await AnalyticsSnapshot.findOneAndUpdate(
        { date: dateOnly, department: 'ALL' },
        {
          totalsByStatus,
          avgResolutionTimeHours,
          slaBreachCount: slaBreaches,
          escalationCountByLevel,
          recurringIssuesCount
        },
        { upsert: true, new: true }
      );

      console.log(`[${new Date().toISOString()}] Daily analytics snapshot saved`);
    } catch (err) {
      console.error('Error running daily analytics job:', err);
    }
  });
};

module.exports = {
  startDailyAnalyticsJob
};

