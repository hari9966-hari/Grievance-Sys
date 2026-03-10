const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./grievance-backend/models/User');
const Complaint = require('./grievance-backend/models/Complaint');
const SLARule = require('./grievance-backend/models/SLARule');

require('dotenv').config({ path: './grievance-backend/.env' });

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/grievance-system', {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 30000
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('\nClearing existing data...');
    await User.deleteMany({}).maxTimeMS(15000);
    await Complaint.deleteMany({}).maxTimeMS(15000);
    await SLARule.deleteMany({}).maxTimeMS(15000);
    console.log('✅ Cleared existing data');

    // Create Admin User
    console.log('\nCreating admin user...');
    const adminPassword = await bcrypt.hash('password', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: adminPassword,
      role: 'admin',
      authorityLevel: 3,
      emailVerified: true,
      trustScore: 100,
      isActive: true
    });
    console.log(`✅ Admin created: admin@test.com`);

    // Create Officer Users
    console.log('\nCreating officer users...');
    const officerPassword = await bcrypt.hash('password', 10);
    const officer1 = await User.create({
      name: 'Officer Smith',
      email: 'officer1@test.com',
      password: officerPassword,
      role: 'officer',
      department: 'Water Supply',
      authorityLevel: 1,
      emailVerified: true,
      trustScore: 100,
      isActive: true
    });

    const officer2 = await User.create({
      name: 'Officer Johnson',
      email: 'officer2@test.com',
      password: officerPassword,
      role: 'officer',
      department: 'Roads & Infrastructure',
      authorityLevel: 2,
      emailVerified: true,
      trustScore: 100,
      isActive: true
    });
    console.log(`✅ Officers created`);

    // Create Citizen Users
    console.log('\nCreating citizen users...');
    const citizenPassword = await bcrypt.hash('password', 10);
    const citizen1 = await User.create({
      name: 'John Citizen',
      email: 'citizen1@test.com',
      password: citizenPassword,
      role: 'citizen',
      authorityLevel: 0,
      emailVerified: true,
      trustScore: 100,
      isActive: true
    });

    const citizen2 = await User.create({
      name: 'Jane Doe',
      email: 'citizen2@test.com',
      password: citizenPassword,
      role: 'citizen',
      authorityLevel: 0,
      emailVerified: true,
      trustScore: 100,
      isActive: true
    });
    console.log(`✅ Citizens created`);

    // Create SLA Rules
    console.log('\nCreating SLA rules...');
    const slaRules = [
      {
        category: 'Water Supply',
        timeLimitInHours: 48,
        department: 'Water Supply',
        escalationPolicy: {
          level1to2: 24,
          level2to3: 48,
          level3toAdmin: 72
        },
        priority: 'High',
        isActive: true
      },
      {
        category: 'Sanitation',
        timeLimitInHours: 72,
        department: 'Sanitation',
        escalationPolicy: {
          level1to2: 24,
          level2to3: 48,
          level3toAdmin: 72
        },
        priority: 'Medium',
        isActive: true
      },
      {
        category: 'Roads & Infrastructure',
        timeLimitInHours: 96,
        department: 'Roads & Infrastructure',
        escalationPolicy: {
          level1to2: 48,
          level2to3: 72,
          level3toAdmin: 96
        },
        priority: 'Medium',
        isActive: true
      },
      {
        category: 'Public Health',
        timeLimitInHours: 24,
        department: 'Public Health',
        escalationPolicy: {
          level1to2: 12,
          level2to3: 24,
          level3toAdmin: 48
        },
        priority: 'Critical',
        isActive: true
      },
      {
        category: 'Education',
        timeLimitInHours: 120,
        department: 'Education',
        escalationPolicy: {
          level1to2: 48,
          level2to3: 72,
          level3toAdmin: 120
        },
        priority: 'Low',
        isActive: true
      },
      {
        category: 'Police',
        timeLimitInHours: 12,
        department: 'Police',
        escalationPolicy: {
          level1to2: 6,
          level2to3: 12,
          level3toAdmin: 24
        },
        priority: 'Critical',
        isActive: true
      }
    ];

    await SLARule.insertMany(slaRules);
    console.log(`✅ Created ${slaRules.length} SLA rules`);

    // Create Sample Complaints
    console.log('\nCreating sample complaints...');
    const futureDeadline = new Date(Date.now() + 48 * 60 * 60 * 1000);
    
    const complaints = [
      {
        title: 'No water supply in sector 5',
        description: 'Water supply has been cut off for 3 days. People are facing hardship.',
        category: 'Water Supply',
        location: 'Sector 5, Block A',
        createdBy: citizen1._id,
        assignedTo: officer1._id,
        status: 'In Progress',
        slaDeadline: futureDeadline,
        escalationLevel: 0,
        priority: 'High',
        duplicateCount: 2
      },
      {
        title: 'Pothole on main road',
        description: 'Large pothole near the market causing traffic accidents.',
        category: 'Roads & Infrastructure',
        location: 'Main Road, Market Area',
        createdBy: citizen2._id,
        assignedTo: officer2._id,
        status: 'Verified',
        slaDeadline: futureDeadline,
        escalationLevel: 0,
        priority: 'Medium'
      },
      {
        title: 'Street light not working',
        description: 'Street light on Elm Street has been broken for weeks.',
        category: 'Roads & Infrastructure',
        location: 'Elm Street',
        createdBy: citizen1._id,
        status: 'Open',
        slaDeadline: futureDeadline,
        escalationLevel: 0,
        priority: 'Low'
      },
      {
        title: 'Garbage not collected',
        description: 'Garbage collection has been delayed for a week.',
        category: 'Sanitation',
        location: 'Sector 3',
        createdBy: citizen2._id,
        assignedTo: officer1._id,
        status: 'Resolved',
        slaDeadline: new Date(Date.now() - 48 * 60 * 60 * 1000),
        escalationLevel: 0,
        priority: 'Medium',
        resolvedAt: new Date(),
        resolvedBy: officer1._id,
        resolutionNotes: 'Garbage collection completed on schedule.'
      }
    ];

    await Complaint.insertMany(complaints);
    console.log(`✅ Created ${complaints.length} sample complaints`);

    console.log('\n' + '='.repeat(50));
    console.log('✅ Database seeding completed successfully!');
    console.log('='.repeat(50));

    console.log('\n📧 Demo Credentials:');
    console.log('---');
    console.log('Admin:   admin@test.com / password');
    console.log('Officer: officer1@test.com / password');
    console.log('Citizen: citizen1@test.com / password');
    console.log('---\n');

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
