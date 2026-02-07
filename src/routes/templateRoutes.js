const express = require('express');
const {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate
} = require('../controllers/templateController');
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', getTemplates);
router.get('/:id', getTemplateById);
router.post('/', authenticateToken, authorizeRoles('admin', 'manager'), createTemplate);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'manager'), updateTemplate);
router.patch('/:id', authenticateToken, authorizeRoles('admin', 'manager'), updateTemplate);
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'manager'), deleteTemplate);

module.exports = router;
