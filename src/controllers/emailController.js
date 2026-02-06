const EmailTemplate = require('../models/EmailTemplate');
const { renderTemplateVariables, sendEmail } = require('../services/emailService');

const sendSingleEmail = async (req, res) => {
  try {
    const { to, subject, html, templateId, variables } = req.body;

    let finalSubject = subject;
    let finalHtml = html;

    if (templateId) {
      const template = await EmailTemplate.findById(templateId);

      if (!template) {
        return res.status(404).json({ message: 'Template not found' });
      }

      finalSubject = template.subject;
      finalHtml = renderTemplateVariables(template.htmlBody, variables);
    }

    if (!to || !finalSubject || !finalHtml) {
      return res.status(400).json({
        message: 'Invalid payload. Provide to + subject + html, or to + templateId (+ optional variables).'
      });
    }

    const info = await sendEmail({ to, subject: finalSubject, html: finalHtml });
    return res.status(200).json({ message: 'Email sent successfully', messageId: info.messageId });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
};

const sendBulkEmails = async (req, res) => {
  try {
    const { recipients, subject, html, templateId } = req.body;

    if (!Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ message: 'recipients must be a non-empty array' });
    }

    let finalSubject = subject;
    let template;

    if (templateId) {
      template = await EmailTemplate.findById(templateId);

      if (!template) {
        return res.status(404).json({ message: 'Template not found' });
      }

      finalSubject = template.subject;
    }

    const results = [];

    for (const recipient of recipients) {
      const to = typeof recipient === 'string' ? recipient : recipient.to;
      const variables = typeof recipient === 'string' ? {} : recipient.variables || {};

      const finalHtml = template
        ? renderTemplateVariables(template.htmlBody, variables)
        : html;

      if (!to || !finalSubject || !finalHtml) {
        results.push({ to, status: 'failed', reason: 'Missing to/subject/html' });
        continue;
      }

      try {
        const info = await sendEmail({ to, subject: finalSubject, html: finalHtml });
        results.push({ to, status: 'sent', messageId: info.messageId });
      } catch (error) {
        results.push({ to, status: 'failed', reason: error.message });
      }
    }

    return res.status(200).json({
      message: 'Bulk email process completed',
      summary: {
        total: results.length,
        sent: results.filter((item) => item.status === 'sent').length,
        failed: results.filter((item) => item.status === 'failed').length
      },
      results
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to send bulk emails', error: error.message });
  }
};

module.exports = {
  sendSingleEmail,
  sendBulkEmails
};
