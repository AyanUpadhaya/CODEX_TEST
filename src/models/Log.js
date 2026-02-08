const mongoose = require('mongoose');

const LOG_TYPES = [
  'user_signed_up',
  'user_logged_in',
  'user_info_updated',
  'template_created',
  'email_sent',
  'bulk_emails_sent'
];

const logSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: LOG_TYPES,
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    actor: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      name: {
        type: String,
        trim: true,
        default: ''
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
        default: ''
      },
      role: {
        type: String,
        default: ''
      }
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

logSchema.index({ type: 1, createdAt: -1 });

module.exports = {
  Log: mongoose.model('Log', logSchema),
  LOG_TYPES
};
