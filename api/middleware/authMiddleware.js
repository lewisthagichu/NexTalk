const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];

      const decooded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decooded.id).select('-password');
    }
  } catch (error) {
    console.log(error);
    res.status(401);
    throw new Error('Invalid token');
  }

  if (!token) {
    res.status(401);
    throw new Error('No token found');
  }
});

module.exports = { protect };
