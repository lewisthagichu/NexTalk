const asyncHandler = require('express-async-handler');

// @desc Create message
// @route POST /api/messages
// @access Private
const createMessage = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error('Empty message');
  }

  res.json({ message: 'success' });

  console.log(req.body);
});

// @desc Get messages
// @route POST /api/messages/:id
// @access Private
const getMessages = asyncHandler(async (req, res) => {});

module.exports = { createMessage, getMessages };
