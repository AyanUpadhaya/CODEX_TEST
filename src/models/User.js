const crypto = require('crypto');
const mongoose = require('mongoose');

const ROLES = ['admin', 'manager', 'staff'];

const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => {
  const hashedPassword = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hashedPassword}`;
};

const verifyPassword = (password, storedPassword) => {
  const [salt, key] = storedPassword.split(':');
  if (!salt || !key) {
    return false;
  }

  const hashedBuffer = crypto.scryptSync(password, salt, 64);
  const keyBuffer = Buffer.from(key, 'hex');

  if (hashedBuffer.length !== keyBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(hashedBuffer, keyBuffer);
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ROLES,
      default: 'staff'
    },
    resetPasswordToken: {
      type: String,
      select: false
    },
    resetPasswordExpiresAt: {
      type: Date,
      select: false
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', function applyPasswordHash(next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = hashPassword(this.password);
  return next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return verifyPassword(candidatePassword, this.password);
};

userSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = {
  User: mongoose.model('User', userSchema),
  ROLES
};
