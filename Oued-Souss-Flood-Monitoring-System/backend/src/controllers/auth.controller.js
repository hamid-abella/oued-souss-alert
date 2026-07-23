const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const authService = require('../services/auth.service');

const SALT_ROUNDS = 10;

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await authService.getUserByEmail(email);

    if (!user)
      return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    res.json({
      token,
      user: {
        user_id: user.user_id,
        name:    user.name,
        email:   user.email,
        role:    user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.user.user_id);

    if (!user)
      return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await authService.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/users
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await authService.createUser(name, email, hashed, role);

    res.status(201).json(user);
  } catch (err) {
    if (err.code === '23505')
      return res.status(409).json({ error: 'Email already in use' });
    next(err);
  }
};

// PATCH /api/auth/users/:id/deactivate
const deactivateUser = async (req, res, next) => {
  try {
    const user = await authService.deactivateUser(req.params.id);

    if (!user)
      return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/auth/users/:id/password
const changePassword = async (req, res, next) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    const user = await authService.changePassword(req.params.id, hashed);

    if (!user)
      return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'Password updated', user });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/auth/users/:id/role
const changeRole = async (req, res, next) => {
  try {
    const user = await authService.changeRole(req.params.id, req.body.role);

    if (!user)
      return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = { login, getMe, getAllUsers, createUser, deactivateUser, changePassword, changeRole };