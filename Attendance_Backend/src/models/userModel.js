const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  empId: Number,
  username: String,
  password: String,
  role: String,
  deletedAt: Date,
},{
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
