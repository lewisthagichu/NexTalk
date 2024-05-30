const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');
const EventEmitter = require('events');

// Create an event emitter
const emitter = new EventEmitter();

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
    file: null,
    time: req.body.time,
  });

  // Destructure properties directly
  const { _id, sender, recipient, text, file, time, createdAt, updatedAt } =
    result;

  // Convert ObjectId instances to strings
  const newMessage = {
    id: _id.toString(),
    sender: sender.toString(),
    recipient: recipient.toString(),
    text,
    file,
    time,
    createdAt,
    updatedAt,
  };

  res.status(200).json(newMessage);
});

// @desc Upload file
// @route POST /api/messages/upload
// @access Private
const uploadFile = asyncHandler(async (req, res) => {
  if (!req.body) {
    res.status(400);
    throw new Error('Empty message');
  }

  // Check if multer detected a file size limit error
  if (req.file && req.file.size === 0) {
    res.status(400);
    throw new Error('File size exceeds the limit (15 MB');
  }

  // Create a new file
  const result = await Message.create({
    sender: req.body.sender,
    recipient: req.body.recipient,
    text: null,
    file: req.file.filename,
    time: req.body.time,
  });

  // Destructure properties directly
  const { _id, sender, recipient, text, file, time, createdAt, updatedAt } =
    result;

  // Convert ObjectId instances to strings
  const newFile = {
    id: _id.toString(),
    sender: sender.toString(),
    recipient: recipient.toString(),
    text,
    file,
    time,
    createdAt,
    updatedAt,
  };

  // Emit an event with the filename
  emitter.emit('fileUploaded', newFile);

  // respond to request
  res.status(200).json(newFile);
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
    file: message.file,
    time: message.time,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  }));

  res.status(200).json(messages);
});

module.exports = { createMessage, uploadFile, getMessages, emitter };
