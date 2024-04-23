const User = require('../models/userModel');
const { hashPassword } = require('../utils/passwordUtils');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {

    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const editUsers = async (req, res) => {
  const userId = req.params.userId;
  const { email, empId, username, password, role} = req.body;
  
  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const hashedPassword = await hashPassword(password);
    user.email = email;
    user.empId = empId;
    user.username = username;
    user.password = hashedPassword;
    user.role = role;

    user.updatedAt = new Date();
    user = await user.save();

    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const data = await User.find({ deletedAt: { $exists: false } });

    const responseData = data.map(user => {
      return {
        Email: user.email,
        Employee_ID: user.empId,
        Username: user.username,
        userId:user._id,
        Role:user.role,
      };
    });

    res.json(responseData);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.deletedAt = new Date();
    await user.save();

    res.json({ message: 'User soft deleted successfully' });
  } catch (error) {
    console.error('Error soft deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllUsers,
  getUsers,
  deleteUser,
  editUsers,
  getUserById
};
