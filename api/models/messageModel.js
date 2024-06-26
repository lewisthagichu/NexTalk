const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    time: { type: Number },
    messageRoom: { type: String },
    text: { type: String },
    file: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
