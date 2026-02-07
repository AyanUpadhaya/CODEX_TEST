const express = require('express');
const { register, login, forgotPassword, resetPassword, getUsers } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/users', authenticateToken, authorizeRoles('admin', 'manager'), getUsers);

module.exports = router;
