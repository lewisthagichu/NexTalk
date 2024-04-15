const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { register, login, getUsers } = require('../controllers/userController');

router.post('/', register);
router.post('/login', login);
router.get('/contacts', protect, getUsers);

module.exports = router;
