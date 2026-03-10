const mongoose = require('mongoose');

const slaRuleSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: [
        'Water Supply',
        'Sanitation',
        'Roads & Infrastructure',
        'Public Health',
        'Education',
        'Police',
        'Other'
      ],
      required: true,
      unique: true
    },
    timeLimitInHours: {
      type: Number,
      required: [true, 'Please provide time limit in hours'],
      min: 1
    },
    department: {
      type: String,
      required: true
    },
    escalationPolicy: {
      // Level 1 -> Level 2 escalation time (in hours)
      level1to2: {
        type: Number,
        default: 24
      },
      // Level 2 -> Level 3 escalation time (in hours)
      level2to3: {
        type: Number,
        default: 48
      },
      // Level 3 -> Admin escalation time (in hours)
      level3toAdmin: {
        type: Number,
        default: 72
      }
    },
    // Optional per-stage SLAs in hours
    verifyWithinHours: {
      type: Number,
      default: null
    },
    respondWithinHours: {
      type: Number,
      default: null
    },
    resolveWithinHours: {
      type: Number,
      default: null
    },
    requiresTwoStepApproval: {
      type: Boolean,
      default: false
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },
    description: String,
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('SLARule', slaRuleSchema);
