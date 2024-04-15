const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/multerConfigMiddleware');
const {
  createMessage,
  uploadFile,
  getMessages,
} = require('../controllers/messageController');

router.post('/', protect, createMessage);
router.post('/upload', protect, upload.single('file'), uploadFile);
router.get('/:id', protect, getMessages);

module.exports = router;
