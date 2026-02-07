const express = require('express');
const { register, login, getUsers } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', authenticateToken, authorizeRoles('admin', 'manager'), getUsers);

module.exports = router;
