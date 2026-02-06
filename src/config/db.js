const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/email_server_api';

  try {
    await mongoose.connect(mongoURI);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Server will continue running, but database-backed routes may fail until MongoDB is available.');
    return false;
  }
};

module.exports = connectDB;
