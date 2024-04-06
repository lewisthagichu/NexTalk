const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/mutlerConfigMiddleware');
const {
  createMessage,
  uploadFile,
  getMessages,
} = require('../controllers/messageController');

router.post('/', protect, createMessage);
router.post('/uploads', protect, uploadFile);
router.get('/:id', protect, getMessages);

module.exports = router;
