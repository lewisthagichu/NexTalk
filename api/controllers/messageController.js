const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');
const Notification = require('../models/notificationModel');

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

    // Create a notification referencing the message
    const notification = await Notification.create({
      sender,
      recipient,
      messageId: newText._id,
      content: newText.text,
    });

    return {
      newText,
      notification,
    };
  } catch (error) {
    throw error;
  }
};

// @desc Create new file text after file has been saved in FS
const uploadFile = async (fileName, data) => {
  try {
    const { sender, recipient, time, messageRoom } = data;

    // Create a new file
    const newFile = await Message.create({
      sender,
      recipient,
      time,
      messageRoom,
      file: fileName,
      text: null,
    });

    // Create a notification referencing the message
    const notification = await Notification.create({
      sender,
      recipient,
      messageId: newFile._id,
      content: newFile.file,
    });

    return {
      newFile,
      notification,
    };
  } catch (error) {
    throw error;
  }
};

// @desc Get messages for selected user/contact
// @route POST /api/messages/:id
// @access Private
const getMessages = asyncHandler(async (req, res) => {
  const selectedUserId = req.params.id;
  const myId = req.user._id;

  const allMessages = await Message.find({
    sender: { $in: [selectedUserId, myId] },
    recipient: { $in: [selectedUserId, myId] },
  }).sort({ createdAt: 1 });

  res.status(200).json(allMessages);
});

module.exports = { createText, uploadFile, getMessages };
