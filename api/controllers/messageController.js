const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');

// @desc Create message
// @route POST /api/messages
// @access Private
const createMessage = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error('Empty message');
  }

  // Create a new message
  const result = await Message.create({
    sender: req.body.sender,
    recipient: req.body.recipient,
    text: req.body.text,
    time: req.body.time,
  });

  // Destructure properties directly
  const { _id, sender, recipient, text, time, createdAt, updatedAt } = result;

  // Convert ObjectId instances to strings
  const newMessage = {
    id: _id.toString(),
    sender: sender.toString(),
    recipient: recipient.toString(),
    text,
    time,
    createdAt,
    updatedAt,
  };

  res.status(200).json(newMessage);
});

// @desc Get messages for selected user/contact
// @route POST /api/messages/:id
// @access Private
const getMessages = asyncHandler(async (req, res) => {
  const selectedUserId = req.params.id;
  const myId = req.user.id;
  const allMessages = await Message.find({
    sender: { $in: [selectedUserId, myId] },
    recipient: { $in: [selectedUserId, myId] },
  }).sort({ createdAt: 1 });

  // Convert ObjectId instances to strings
  const messages = allMessages.map((message) => ({
    id: message._id.toString(),
    sender: message.sender.toString(),
    recipient: message.recipient.toString(),
    text: message.text,
    time: message.time,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  }));

  res.status(200).json(messages);
});

module.exports = { createMessage, getMessages };
