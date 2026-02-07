const dotenv = require('dotenv');
const connectDB = require('../src/config/db');
const { User } = require('../src/models/User');

dotenv.config();

const seedUser = {
  name: process.env.SEED_USER_NAME || 'System Admin',
  email: process.env.SEED_USER_EMAIL || 'admin@example.com',
  password: process.env.SEED_USER_PASSWORD || 'admin123',
  role: process.env.SEED_USER_ROLE || 'admin'
};

const seedUsers = async () => {
  try {
    await connectDB();

    const existingUser = await User.findOne({ email: seedUser.email.toLowerCase() });
    if (existingUser) {
      console.log(`User already exists for email ${seedUser.email}`);
      process.exit(0);
    }

    await User.create(seedUser);
    console.log(`Seed user created: ${seedUser.email} (${seedUser.role})`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed user:', error.message);
    process.exit(1);
  }
};

seedUsers();
