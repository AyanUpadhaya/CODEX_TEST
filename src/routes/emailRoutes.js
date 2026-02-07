const express = require('express');
const { sendSingleEmail, sendBulkEmails } = require('../controllers/emailController');
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/send', authenticateToken, authorizeRoles('admin', 'manager', 'staff'), sendSingleEmail);
router.post('/send-bulk', authenticateToken, authorizeRoles('admin', 'manager', 'staff'), sendBulkEmails);

module.exports = router;
