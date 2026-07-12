const mongoose = require('mongoose');
const { User } = require('./models/YashModels');

const email = process.argv[2];

if (!email) {
  console.error('Usage: node promote-admin.js <user-email>');
  process.exit(1);
}

const promote = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/assetflow');
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email });
    if (!user) {
      console.error(`User with email ${email} not found.`);
      process.exit(1);
    }

    user.role = 'Admin';
    await user.save();

    console.log(`Successfully promoted ${user.name} (${user.email}) to Admin!`);
    process.exit(0);
  } catch (error) {
    console.error('Error promoting user:', error);
    process.exit(1);
  }
};

promote();
