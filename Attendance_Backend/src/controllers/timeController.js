const { Time, DailyTime } = require('../models/timeModel');

const createTime =  async (req, res) => {
  try {
    const { userId, username, entry, exit } = req.body;
    if (entry) {
      const time = await Time.create({ userId, username, entryTime: new Date(),type:'entry' });
      time.save();
      return res.json(time);
    }
    if (exit) {
      const time = await Time.findOne({ userId }).sort({ _id: -1 });
  
      if (time) {
          time.exitTime = new Date();
          time.type = 'exit';
  
          if (time.entryTime) {
              time.totalTime = time.exitTime.getTime() - time.entryTime.getTime();
          }
  
          await time.save();
      } return res.json(time);
  }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const lastData = async (req, res) => {
    const userId = req.params.userId;
    try {
      const lastData = await Time.findOne({ userId }).sort({ _id: -1 });
      if (lastData) {
        if (lastData.type=='entry') {
          res.json({ time: lastData.entryTime, type: 'entry' });
        } else if (lastData.type=='exit') {
          res.json({ time: lastData.exitTime, type: 'exit' });
        } else {
          res.json({ error: 'No entry or exit time found' });
        }
      } else {
        res.json({ error: 'No data found' });
      }
    } catch (error) {
      console.error('Error retrieving last time:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  const allUsersTime = async (req, res) => {
    try {
        const times = await Time.find().sort({ totalTime: 1 });
        const dailyTimes = {};

        times.forEach((time) => {
            const date = time.createdAt.toISOString().split('T')[0];

            if (!dailyTimes[date]) {
                dailyTimes[date] = {};
            }

            if (!dailyTimes[date][time.username]) {
                dailyTimes[date][time.username] = 0;
            }

            if (time.totalTime) {
                dailyTimes[date][time.username] += parseFloat(time.totalTime);
            }
        });

        const result = {};
        Object.keys(dailyTimes).forEach((date) => {
            Object.keys(dailyTimes[date]).forEach((username) => {
                if (!result[username]) {
                    result[username] = [];
                }
                result[username].push({ date, totalTime: dailyTimes[date][username] });
            });
        });

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}
  const dailyTime = async (req, res) => {
    const userId = req.params.userId;
    try {
        const times = await Time.find({ userId }).sort({ totalTime: 1 });
        const dailyTimes = {};

        times.forEach((time) => {
            const date = time.createdAt.toISOString().split('T')[0];

            if (!dailyTimes[date]) {
                dailyTimes[date] = 0;
            }

            if (time.totalTime) {
                dailyTimes[date] += parseFloat(time.totalTime);
            }
        });

        const totalTimesArray = Object.keys(dailyTimes).map((date) => ({
            date,
            totalTime: dailyTimes[date]
        }));

        res.json(totalTimesArray);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}
  module.exports = {
    createTime,
    lastData,
    dailyTime,
    allUsersTime
  }