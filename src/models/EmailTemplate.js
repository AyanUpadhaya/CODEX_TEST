const mongoose = require('mongoose');

const emailTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    htmlBody: {
      type: String,
      required: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('EmailTemplate', emailTemplateSchema);
