const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const EmailTemplate = require('../src/models/EmailTemplate');

dotenv.config();

const templates = [
  {
    name: 'otp-verification',
    subject: 'Your OTP Code',
    description: 'Sends a one-time password to verify user identity.',
    htmlBody: `
      <h2>Hello {{name}},</h2>
      <p>Your OTP code is: <strong>{{otp}}</strong></p>
      <p>This code expires in {{expiryMinutes}} minutes.</p>
    `
  },
  {
    name: 'reset-password',
    subject: 'Reset Your Password',
    description: 'Sends user a password reset link.',
    htmlBody: `
      <h2>Hello {{name}},</h2>
      <p>We received a request to reset your password.</p>
      <p>Click here: <a href="{{resetLink}}">Reset Password</a></p>
      <p>If you did not request this, please ignore this email.</p>
    `
  },
  {
    name: 'welcome-email',
    subject: 'Welcome to Our Platform',
    description: 'Welcome email for new users.',
    htmlBody: `
      <h1>Welcome, {{name}} 🎉</h1>
      <p>Thanks for joining our platform. We are glad to have you.</p>
    `
  }
];

const seedTemplates = async () => {
  try {
    await connectDB();
    await EmailTemplate.deleteMany({});
    await EmailTemplate.insertMany(templates);
    console.log('Templates seeded successfully.');
  } catch (error) {
    console.error('Failed to seed templates:', error.message);
  } finally {
    await mongoose.connection.close();
  }
};

seedTemplates();
