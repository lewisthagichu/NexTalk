const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  registerUser,
  loginUser,
  getUsers,
} = require('../controllers/userController');

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/contacts', protect, getUsers);

module.exports = router;
