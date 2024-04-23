const express = require('express');
const router = express.Router();
const { getAllUsers, getUsers , deleteUser , editUsers,getUserById} = require('../controllers/userController');
const verifyToken = require('../middleware');

router.get('/',verifyToken, getAllUsers);

router.get('/allusers',verifyToken,getUsers);

router.delete('/delete/:userId',verifyToken, deleteUser);

router.put('/edit/:userId',verifyToken, editUsers);

router.get('/user/:userId',verifyToken,getUserById);

module.exports = router;
