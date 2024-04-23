const express = require('express');
const router = express.Router();
const { createTime, lastData, dailyTime ,allUsersTime } = require('../controllers/timeController');
const verifyToken = require('../middleware');

router.post('/createTime',verifyToken, createTime);
router.get('/:userId/lastData',verifyToken, lastData);
router.get('/:userId/dailyTime',verifyToken,dailyTime);
router.get('/dailyTime/allUsers',verifyToken,allUsersTime);

module.exports = router;