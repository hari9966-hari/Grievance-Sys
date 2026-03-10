const mongoose = require('mongoose');

const analyticsSnapshotSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true
    },
    department: {
      type: String,
      default: 'ALL'
    },
    totalsByStatus: {
      type: Object,
      default: {}
    },
    avgResolutionTimeHours: {
      type: Number,
      default: 0
    },
    slaBreachCount: {
      type: Number,
      default: 0
    },
    escalationCountByLevel: {
      type: Object,
      default: {}
    },
    recurringIssuesCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

analyticsSnapshotSchema.index({ date: 1, department: 1 }, { unique: true });

module.exports = mongoose.model('AnalyticsSnapshot', analyticsSnapshotSchema);

