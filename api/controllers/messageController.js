const asyncHandler = require('express-async-handler');

// @desc Create message
// @route POST /api/messages
// @access Private
const createMessage = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error('Empty message');
  }

  console.log(req.body);
});

module.exports = { createMessage };
