const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: false, unique: true, sparse: true, trim: true },
  password: { type: String, required: false },
  githubId: { type: String, unique: true, sparse: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
