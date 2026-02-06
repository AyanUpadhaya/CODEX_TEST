const express = require('express');
const { sendSingleEmail, sendBulkEmails } = require('../controllers/emailController');

const router = express.Router();

router.post('/send', sendSingleEmail);
router.post('/send-bulk', sendBulkEmails);

module.exports = router;
