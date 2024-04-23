const mongoose = require('mongoose');

const timeSchema = new mongoose.Schema(
  {
    userId: String,
    username: String,
    entryTime: { type: Date },
    exitTime: { type: Date },
    totalTime: { type: Number },
    type : String
  },
  {
    timestamps: true,
  }
);
const dailyTimeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  totalTime: {
    type: Date,
    required: true
  }
},{
  timestamps: true
});

const Time = mongoose.model('Time', timeSchema);
const DailyTime = mongoose.model('DailyTime', dailyTimeSchema);

module.exports = { Time, DailyTime };
