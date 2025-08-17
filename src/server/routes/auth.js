const express = require('express');
const { body, validationResult } = require('express-validator');
const { hashPassword, verifyPassword, generateTokens, refreshAccessToken, revokeRefreshToken } = require('../utils/auth');
const { authenticateToken } = require('../middleware/auth');
const { authRateLimit } = require('../middleware/rateLimit');
const { asyncHandler } = require('../middleware/errorHandler');
const { getDatabase } = require('../config/db');
const logger = require('../utils/logger');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
  body('role').optional().isIn(['admin', 'attorney', 'staff']).withMessage('Invalid role')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

// Register new user
router.post('/register', authRateLimit, registerValidation, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, firstName, lastName, role = 'staff' } = req.body;
  const db = getDatabase();

  // Check if user already exists
  const existingUser = await db('users')
    .where({ email, tenant_id: req.tenant.id })
    .first();

  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' });
  }

  // Hash password and create user
  const passwordHash = await hashPassword(password);
  
  const [user] = await db('users')
    .insert({
      tenant_id: req.tenant.id,
      email,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      role,
      status: 'active'
    })
    .returning(['id', 'email', 'first_name', 'last_name', 'role', 'status']);

  // Generate tokens
  const tokens = await generateTokens({
    userId: user.id,
    tenantId: req.tenant.id,
    email: user.email,
    role: user.role
  });

  logger.info(`User registered: ${email} for tenant ${req.tenant.subdomain}`);

  res.status(201).json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      status: user.status
    },
    ...tokens
  });
}));

// Login user
router.post('/login', authRateLimit, loginValidation, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const db = getDatabase();

  // Find user
  const user = await db('users')
    .where({ email, tenant_id: req.tenant.id })
    .first();

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (user.status !== 'active') {
    return res.status(401).json({ error: 'Account is not active' });
  }

  // Verify password
  const isValidPassword = await verifyPassword(password, user.password_hash);
  if (!isValidPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Update last login
  await db('users')
    .where({ id: user.id })
    .update({ last_login_at: db.fn.now() });

  // Generate tokens
  const tokens = await generateTokens({
    userId: user.id,
    tenantId: req.tenant.id,
    email: user.email,
    role: user.role
  });

  logger.info(`User logged in: ${email} for tenant ${req.tenant.subdomain}`);

  res.json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      status: user.status,
      lastLoginAt: user.last_login_at
    },
    ...tokens
  });
}));

// Refresh token
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token required' });
  }

  try {
    const accessToken = await refreshAccessToken(refreshToken);
    res.json({ accessToken });
  } catch (error) {
    logger.warn('Token refresh failed:', error.message);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
}));

// Logout user
router.post('/logout', authenticateToken, asyncHandler(async (req, res) => {
  await revokeRefreshToken(req.user.id);
  logger.info(`User logged out: ${req.user.email}`);
  res.json({ message: 'Logged out successfully' });
}));

// Get current user
router.get('/me', authenticateToken, asyncHandler(async (req, res) => {
  const db = getDatabase();
  
  const user = await db('users')
    .where({ id: req.user.id })
    .select(['id', 'email', 'first_name', 'last_name', 'role', 'status', 'avatar_url', 'preferences', 'last_login_at', 'created_at'])
    .first();

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    role: user.role,
    status: user.status,
    avatarUrl: user.avatar_url,
    preferences: user.preferences,
    lastLoginAt: user.last_login_at,
    createdAt: user.created_at
  });
}));

module.exports = router;