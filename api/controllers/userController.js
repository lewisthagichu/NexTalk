const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bycrypt = require('bcryptjs');

// Register user
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
    throw new Error('Username already taken');
  }

  // Hash password
  const salt = await bycrypt.genSalt(10);
  const hashedPassword = await bycrypt.hash(password, salt);

  // Create user
  const createdUser = await User.create({ username, password: hashedPassword });

  // Server response
  if (createdUser) {
    const token = generateToken(createdUser._id);
    res.status(201).json({ id: createdUser._id, username, token });
  } else {
    res.status(401);
    throw new Error('Invalid username or password');
  }
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(401);
    throw new Error('Invalid username or password');
  }

  const user = await User.findOne({ username });

  if (user && bycrypt.compare(user.password, password)) {
    res.status(201).json({ id: user.id, username });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// Get user profile
const getProfile = asyncHandler(async (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401);
    throw new Error('No profile found');
  }
});

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
}

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};
