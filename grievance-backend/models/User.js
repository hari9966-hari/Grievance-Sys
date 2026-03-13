const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['citizen', 'officer', 'admin'],
      default: 'citizen'
    },
    department: {
      type: String,
      enum: [
        'Water Supply',
        'Sanitation',
        'Roads & Infrastructure',
        'Public Health',
        'Education',
        'Police',
        'Electricity',
        'Parks & Recreation',
        'Transportation',
        'Other',
        null
      ],
      required: false,
      default: null
    },
    authorityLevel: {
      type: Number,
      enum: [0, 1, 2, 3],
      // 0: No authority (citizen)
      // 1: First level officer
      // 2: Senior officer
      // 3: Admin
      default: 0
    },
    trustScore: {
      type: Number,
      default: 100,
      min: 0,
      max: 100
    },
    emailVerified: {
      type: Boolean,
      default: true
    },
    emailVerificationToken: {
      type: String,
      select: false
    },
    openComplaintCount: {
      type: Number,
      default: 0
    },
    resolvedComplaintCount: {
      type: Number,
      default: 0
    },
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

// Middleware: Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method: Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
