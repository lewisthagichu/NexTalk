const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bycrypt = require('bcryptjs');

// @desc Register new user
// @route POST /api/users/
// @access Public
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
    const token = generateToken(createdUser._id, createdUser.username);
    res.status(201).json({ id: createdUser._id, username, token });
  } else {
    res.status(401);
    throw new Error('Invalid username or password');
  }
});

// @desc Login existing account
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(401);
    throw new Error('Invalid username or password');
  }

  const user = await User.findOne({ username });

  if (user && bycrypt.compare(user.password, password)) {
    res.status(201).json({
      id: user.id,
      username,
      token: generateToken(user._id, user.username),
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// @desc get all registered users from DB
// @route GET /api/users/
// @access Private
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}, { _id: 1, username: 1 });

  // Map through the array and rename "_id" to "id" in each user object
  const allUsers = users.map((user) => {
    return {
      id: user._id.toString(),
      username: user.username,
    };
  });

  res.status(200).json(allUsers);
});

// Generate a jwt token
function generateToken(id, username) {
  return jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
}

module.exports = {
  registerUser,
  loginUser,
  getUsers,
};
