const express = require('express');
const router = express.Router();
const { registerUser, getProfile } = require('../controllers/userController');

router.post('/', registerUser);
router.get('/profile', getProfile);

module.exports = router;
