// config/db.js
const mongoose = require('mongoose'); // <-- make sure this line exists

const connectDB = async (uri) => {
  if (!uri) {
    throw new Error('MongoDB URI is not defined in .env');
  }
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // exit if DB connection fails
  }
};

module.exports = connectDB;
