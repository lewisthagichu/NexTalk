const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, 'Please enter a username'],
    },
    password: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
