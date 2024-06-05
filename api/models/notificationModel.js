// Notification Model
const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
