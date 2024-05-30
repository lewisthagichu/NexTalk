const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  register,
  login,
  getUsers,
  checkToken,
} = require('../controllers/userController');

router.post('/', register);
router.post('/login', login);
router.get('/contacts', protect, getUsers);
router.post('/newToken', checkToken);

module.exports = router;
