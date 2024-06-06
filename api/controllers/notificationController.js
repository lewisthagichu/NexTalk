const asyncHandler = require('express-async-handler');
const Notification = require('../models/notificationModel');

// @desc Get notifications
// @route GET /api/notifications
// @access Private
const getNotifications = asyncHandler(async (req, res) => {
  const myId = req.user.id;

  // Fetch notifications and populate the message details
  const notifications = await Notification.find({
    recipientId: myId,
    isRead: false,
  }).populate('messageId', 'text file sender recipient');

  res.status(200).json(notifications);
});

// @desc Mark selected user notifications as read
// @route GET /api/notifications
// @access Private

const markAsRead = asyncHandler(async (req, res) => {
  const { sender } = req.body;
  const myId = req.user._id;
  await Notification.updateMany({ recipient: myId, sender }, { isRead: true });

  res.status(200).json({ success: true });
});

module.exports = { getNotifications, markAsRead };
