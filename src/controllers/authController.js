const crypto = require('crypto');
const { User, ROLES } = require('../models/User');
const { signToken } = require('../utils/jwt');
const { sendEmail } = require('../services/emailService');

const RESET_PASSWORD_EXPIRY_MS = 24 * 60 * 60 * 1000;

const buildToken = (user) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';

  if (!secret) {
    throw new Error('JWT_SECRET is not configured.');
  }

  return signToken(
    {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name
    },
    secret,
    { expiresIn }
  );
};

const buildResetPasswordUrl = (req, token) => {
  const configuredBaseUrl = process.env.RESET_PASSWORD_URL_BASE || process.env.CLIENT_URL;

  if (configuredBaseUrl) {
    return `${configuredBaseUrl.replace(/\/$/, '')}/reset-password/${token}`;
  }

  return `${req.protocol}://${req.get('host')}/api/auth/reset-password/${token}`;
};

const register = async (req, res) => {
  try {
    const { name, email, password, role = 'staff' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required.' });
    }

    if (!ROLES.includes(role)) {
      return res.status(400).json({ message: `role must be one of: ${ROLES.join(', ')}` });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    const user = await User.create({ name, email, password, role });
    const token = buildToken(user);

    return res.status(201).json({
      message: 'User registered successfully.',
      data: {
        user: user.toSafeJSON(),
        token
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to register user.', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = buildToken(user);

    return res.status(200).json({
      message: 'Login successful.',
      data: {
        user: user.toSafeJSON(),
        token
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to login user.', error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'email is required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+resetPasswordToken +resetPasswordExpiresAt');

    if (!user) {
      return res.status(200).json({
        message: 'If the email exists, a reset link has been sent.'
      });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiresAt = new Date(Date.now() + RESET_PASSWORD_EXPIRY_MS);
    await user.save();

    const resetPasswordUrl = buildResetPasswordUrl(req, rawToken);

    await sendEmail({
      to: user.email,
      subject: 'Reset your password',
      html: `
        <p>Hello ${user.name},</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <p><a href="${resetPasswordUrl}">${resetPasswordUrl}</a></p>
        <p>This link expires in 24 hours.</p>
      `
    });

    return res.status(200).json({
      message: 'If the email exists, a reset link has been sent.'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to process forgot password request.', error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'token and password are required.' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiresAt: { $gt: new Date() }
    }).select('+resetPasswordToken +resetPasswordExpiresAt');

    if (!user) {
      return res.status(400).json({ message: 'Reset token is invalid or has expired.' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    return res.status(200).json({ message: 'Password reset successful.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to reset password.', error: error.message });
  }
};

const getUsers = async (_req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    return res.status(200).json({
      data: users.map((user) => user.toSafeJSON())
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch users.', error: error.message });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  getUsers
};
