const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createMessage);
router.get('/', protect, getMessages);
