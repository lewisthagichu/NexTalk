const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bycrypt = require('bcryptjs');

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

  // Hash password
  const salt = await bycrypt.genSalt(10);
  const hashedPassword = await bycrypt.hash(password, salt);

  const createdUser = await User.create({ username, password: hashedPassword });
  if (createdUser) {
    const token = generateToken(createdUser._id, username);
    res
      .cookie('token', token, { sameSite: 'none' })
      .status(201)
      .json({ id: createdUser._id });
  } else {
    res.status(401);
    throw new Error('Invalid username or password');
  }
});

// Get user profile
const getProfile = asyncHandler(async (req, res) => {
  try {
    const { token } = req?.cookies;

    if (token) {
      const userData = jwt.verify(token, process.env.JWT_SECRET);
      res.json(userData);
    }
  } catch (error) {
    console.log(error);
    res.status(401);
    throw new Error('Not logged in');
  }
});

function generateToken(id, username) {
  return jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
}

module.exports = {
  registerUser,
  getProfile,
};
