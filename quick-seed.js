const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Direct schemas (avoid model import issues)
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, sparse: true },
  password: String,
  role: String,
  department: String,
  authorityLevel: Number,
  emailVerified: Boolean,
  trustScore: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
});

const complaintSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  location: String,
  createdBy: mongoose.Schema.Types.ObjectId,
  assignedTo: mongoose.Schema.Types.ObjectId,
  status: String,
  priority: String,
  slaDeadline: Date,
  escalationLevel: Number,
  createdAt: Date
});

const slaSchema = new mongoose.Schema({
  category: String,
  timeLimitInHours: Number,
  department: String,
  escalationPolicy: {
    level1to2: Number,
    level2to3: Number,
    level3toAdmin: Number
  }
});

const seed = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/grievance-system', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000
    });
    console.log('✅ Connected!\n');

    const User = mongoose.model('User', userSchema);
    const Complaint = mongoose.model('Complaint', complaintSchema);
    const SLARule = mongoose.model('SLARule', slaSchema);

    // Clear collections
    console.log('🧹 Clearing collections...');
    await User.collection.deleteMany({});
    await Complaint.collection.deleteMany({});
    await SLARule.collection.deleteMany({});
    console.log('✅ Cleared!\n');

    // Create users
    console.log('👤 Creating users...');
    const hashedPwd = await bcrypt.hash('password', 10);

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPwd,
      role: 'admin',
      authorityLevel: 3,
      emailVerified: true,
      trustScore: 100,
      isActive: true,
      createdAt: new Date()
    });

    const officerUser = await User.create({
      name: 'Officer User',
      email: 'officer@example.com',
      password: hashedPwd,
      role: 'officer',
      department: 'General',
      authorityLevel: 1,
      emailVerified: true,
      trustScore: 100,
      isActive: true,
      createdAt: new Date()
    });

    const citizenUser = await User.create({
      name: 'Citizen User',
      email: 'citizen@example.com',
      password: hashedPwd,
      role: 'citizen',
      authorityLevel: 0,
      emailVerified: true,
      trustScore: 100,
      isActive: true,
      createdAt: new Date()
    });

    console.log(`✅ Created 3 users`);
    console.log(`   - admin@example.com / password`);
    console.log(`   - officer@example.com / password`);
    console.log(`   - citizen@example.com / password\n`);

    // Create SLA rules
    console.log('📋 Creating SLA rules...');
    await SLARule.create([
      {
        category: 'Water Supply',
        timeLimitInHours: 48,
        department: 'Water Supply',
        escalationPolicy: { level1to2: 24, level2to3: 48, level3toAdmin: 72 }
      },
      {
        category: 'Roads',
        timeLimitInHours: 72,
        department: 'Roads',
        escalationPolicy: { level1to2: 36, level2to3: 72, level3toAdmin: 96 }
      },
      {
        category: 'Electricity',
        timeLimitInHours: 36,
        department: 'Electricity',
        escalationPolicy: { level1to2: 18, level2to3: 36, level3toAdmin: 48 }
      }
    ]);
    console.log('✅ Created SLA rules\n');

    console.log('🎉 Database seeding completed successfully!\n');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seed();
