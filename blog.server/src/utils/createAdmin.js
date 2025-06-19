// createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existingAdmin = await User.findOne({ role: 'admin' });
  if (existingAdmin) {
    console.log('✅ Admin user already exists');
    return process.exit(0);
  }

  const hashedPassword = await bcrypt.hash('admin@pass', 10);

  const admin = new User({
    full_name: 'Admin Admin',
    email: 'admin@gmail.com',
    password: hashedPassword,
    role: 'admin',
    bio: 'I am the super admin',
    profile_picture: '' // Optional: default or admin image URL
  });

  await admin.save();
  console.log('✅ Admin user created successfully');
  process.exit(0);
};

createAdmin().catch(err => {
  console.error('❌ Error creating admin:', err);
  process.exit(1);
});
