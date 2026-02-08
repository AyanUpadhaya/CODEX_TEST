const express = require('express');
const { register, login, forgotPassword, resetPassword, getUsers, updateUser } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/users', authenticateToken, authorizeRoles('admin', 'manager'), getUsers);
router.patch('/users/:id', authenticateToken, authorizeRoles('admin', 'manager'), updateUser);

module.exports = router;
