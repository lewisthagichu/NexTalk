const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/multerConfigMiddleware');
const { uploadFile, getMessages } = require('../controllers/messageController');

router.get('/:id', protect, getMessages);
router.post(
  '/upload',
  protect,
  upload.single('file'),
  uploadFile,
  (err, req, res, next) => {
    // Error-handling middleware
    if (err) {
      console.log(err.message);
      res.status(400);
      throw new Error(err.message);
    } else {
      next();
    }
  }
);

module.exports = router;
