const asyncHandler = require('express-async-handler');
const Notification = require('../models/notificationModel');

// @desc Get notifications
// @route GET /api/notifications
// @access Private
const getNotifications = asyncHandler(async (req, res) => {
  const myId = req.user.id;

  const notifications = await Notification.find({
    recipient: myId,
    isRead: false,
  });

  res.status(200).json(notifications);
});

module.exports = { getNotifications };
