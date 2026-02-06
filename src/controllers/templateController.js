const EmailTemplate = require('../models/EmailTemplate');

const createTemplate = async (req, res) => {
  try {
    const template = await EmailTemplate.create(req.body);
    return res.status(201).json({ message: 'Template created successfully', data: template });
  } catch (error) {
    return res.status(400).json({ message: 'Failed to create template', error: error.message });
  }
};

const getTemplates = async (_req, res) => {
  try {
    const templates = await EmailTemplate.find().sort({ createdAt: -1 });
    return res.status(200).json({ data: templates });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch templates', error: error.message });
  }
};

const getTemplateById = async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    return res.status(200).json({ data: template });
  } catch (error) {
    return res.status(400).json({ message: 'Failed to fetch template', error: error.message });
  }
};

const updateTemplate = async (req, res) => {
  try {
    const template = await EmailTemplate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    return res.status(200).json({ message: 'Template updated successfully', data: template });
  } catch (error) {
    return res.status(400).json({ message: 'Failed to update template', error: error.message });
  }
};

const deleteTemplate = async (req, res) => {
  try {
    const template = await EmailTemplate.findByIdAndDelete(req.params.id);

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    return res.status(200).json({ message: 'Template deleted successfully' });
  } catch (error) {
    return res.status(400).json({ message: 'Failed to delete template', error: error.message });
  }
};

module.exports = {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate
};
