const nodemailer = require('nodemailer');

const renderTemplateVariables = (htmlBody, variables = {}) => {
  return Object.entries(variables).reduce((html, [key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    return html.replace(regex, String(value));
  }, htmlBody);
};

const getTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

const sendEmail = async ({ to, subject, html }) => {
  const transporter = getTransporter();

  const fromName = process.env.DEFAULT_SENDER_NAME || 'Email API Service';

  return transporter.sendMail({
    from: `${fromName} <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
};

module.exports = {
  renderTemplateVariables,
  sendEmail
};
