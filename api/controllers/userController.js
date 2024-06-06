const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bycrypt = require('bcryptjs');

// @desc Register new user
// @route POST /api/users/
// @access Public
const register = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error('Invalid username or password');
  }

  // Check if the user already exists
  const userExists = await User.findOne({ username });
  if (userExists) {
    res.status(409);
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
    res.status(201).json({ _id: createdUser._id, username, token });
  } else {
    res.status(500);
    throw new Error('Internal Server Error');
  }
});

// @desc Login existing account
// @route POST /api/users/login
// @access Public
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error('Invalid username or password');
  }

  const user = await User.findOne({ username });

  if (user && (await bycrypt.compare(password, user.password))) {
    const token = generateToken(user._id, user.username);
    console.log(user._id);
    res.status(200).json({
      _id: user._id,
      username,
      token,
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// @desc get all registered users from DB
// @route GET /api/users/contacts
// @access Private
const getUsers = asyncHandler(async (req, res) => {
  // Get the current user's ID from req.user.id
  const currentUserId = req.user._id;

  // Query the database to find all users except the current user
  const users = await User.find(
    { _id: { $ne: currentUserId } },
    { _id: 1, username: 1 }
  );

  res.status(200).json(users);
});

// Generate a jwt token

function generateToken(_id, username) {
  try {
    const payload = { _id, username };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Token generation failed');
  }
}

module.exports = {
  register,
  login,
  getUsers,
};

// Regenerate new token
// const checkToken = asyncHandler(async (req, res) => {
//   const token =
//     req.headers.authorization && req.headers.authorization.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ message: 'Not authorized, no token' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id).select('-password');

//     if (!user) {
//       return res
//         .status(401)
//         .json({ message: 'Not authorized, user not found' });
//     }

//     const newToken = generateToken(user._id, user.username);
//     res.status(200).json({ newToken });
//   } catch (err) {
//     res.status(401).json({ message: 'Token expired or invalid' });
//   }
// });
