const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('./models/YashModels');

const seed = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/assetflow');
    console.log('Connected to MongoDB');

    const email = 'admin@company.com';
    const password = 'password123';
    
    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`User ${email} already exists.`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const adminUser = new User({
      name: 'System Admin',
      email,
      password: hashedPassword,
      role: 'Admin'
    });

    await adminUser.save();
    console.log('\n--- Initial Admin Credentials Created ---');
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Role:     Admin`);
    console.log('----------------------------------------\n');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seed();
