const { User, ROLES } = require('../models/User');
const { signToken } = require('../utils/jwt');

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
  getUsers
};
