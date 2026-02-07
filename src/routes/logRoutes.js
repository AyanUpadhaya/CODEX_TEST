const express = require('express');
const { getLogs, getLogById, clearLogs } = require('../controllers/logController');
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', authenticateToken, authorizeRoles('admin', 'manager'), getLogs);
router.get('/:id', authenticateToken, authorizeRoles('admin', 'manager'), getLogById);
router.delete('/', authenticateToken, authorizeRoles('admin'), clearLogs);

module.exports = router;
