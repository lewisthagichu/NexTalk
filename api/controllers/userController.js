const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error('Invalid username or password');
  }

  // Check if the user already exists
  const userExists = await User.findOne({ username });
  if (userExists) {
    res.status(401);
    throw new Error('User already exists');
  }

  const createdUser = await User.create({ username, password });
  if (createdUser) {
    const token = generateToken(createdUser._id);
    res.cookie('token', token).status(201).json({ _id: createdUser._id });
  } else {
    res.status(401);
    throw new Error('Invalid username or password');
  }
});

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
}

module.exports = {
  registerUser,
};
