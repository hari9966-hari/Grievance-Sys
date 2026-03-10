const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    // Basic Information
    title: {
      type: String,
      required: [true, 'Please provide a complaint title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
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
      required: [true, 'Please select a category']
    },
    location: {
      type: String,
      required: [true, 'Please provide location details']
    },

    // User Information
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    // Status Management
    status: {
      type: String,
      enum: ['Open', 'Verified', 'In Progress', 'Resolved', 'Escalated', 'Closed'],
      default: 'Open'
    },
    currentStage: {
      type: String,
      enum: ['verification', 'response', 'resolution'],
      default: 'verification'
    },
    stageDeadline: {
      type: Date
    },

    // SLA Management
    slaDeadline: {
      type: Date,
      required: true
    },
    escalationLevel: {
      type: Number,
      default: 0,
      min: 0,
      max: 3
    },
    escalationHistory: [
      {
        timestamp: {
          type: Date,
          default: Date.now
        },
        fromLevel: Number,
        toLevel: Number,
        reason: String,
        assignedTo: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        newDeadline: Date
      }
    ],

    // Duplicate & Support Handling
    supporters: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        supportedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    duplicateCount: {
      type: Number,
      default: 0
    },
    linkedDuplicateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      default: null
    },

    // Image Handling
    image: {
      type: String,
      default: null
    },
    imageHash: {
      type: String,
      default: null
    },
    previousImageHashes: [String],

    // Recurring Issue Tracking
    isRecurring: {
      type: Boolean,
      default: false
    },
    previousComplaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      default: null
    },
    occurrenceCount: {
      type: Number,
      default: 1
    },

    // Resolution
    resolutionProof: {
      type: String,
      default: null
    },
    resolutionProofHash: {
      type: String,
      default: null
    },
    resolutionNotes: {
      type: String,
      default: null
    },
    resolvedAt: {
      type: Date,
      default: null
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    // Metadata
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Low'
    },
    isFake: {
      type: Boolean,
      default: false
    },
    fakeReportCount: {
      type: Number,
      default: 0
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

// Index for faster queries
complaintSchema.index({ createdBy: 1, status: 1 });
complaintSchema.index({ assignedTo: 1, status: 1 });
complaintSchema.index({ category: 1, location: 1 });
complaintSchema.index({ slaDeadline: 1, status: 1 });
complaintSchema.index({ imageHash: 1 });

module.exports = mongoose.model('Complaint', complaintSchema);
