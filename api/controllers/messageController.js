const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');
const EventEmitter = require('events');

// Create an event emitter
const emitter = new EventEmitter();

// @desc Create texts received by server
const createText = async (messageData) => {
  try {
    if (!messageData) {
      throw new Error('Empty message');
    }

    const { sender, recipient, time, messageRoom, text } = messageData;
    // Create a new text
    const newText = await Message.create({
      sender,
      recipient,
      time,
      messageRoom,
      text,
      file: null,
    });
    return newText;
  } catch (error) {
    throw error;
  }
};

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
  const newFile = await Message.create({
    sender: req.body.sender,
    recipient: req.body.recipient,
    text: null,
    file: req.file.filename,
    time: req.body.time,
  });

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

  res.status(200).json(allMessages);
});

module.exports = { createText, uploadFile, getMessages, emitter };
