const express = require('express');
const router = express.Router();
const { addLeave, deleteLeave, getLeave } = require('../controllers/leaveController');
const verifyToken = require('../middleware');

router.post('/add',verifyToken, addLeave);
router.delete('/:date',verifyToken, deleteLeave);
router.get('/',verifyToken,getLeave);

module.exports = router;
