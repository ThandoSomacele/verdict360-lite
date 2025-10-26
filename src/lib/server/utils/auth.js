const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getRedisClient } = require('../config/redis');
const logger = require('./logger');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('JWT secrets must be configured in environment variables');
}

const hashPassword = async (password) => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

const verifyPassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Generate JWT access and refresh tokens
 *
 * SECURITY NOTE: Payload should only contain non-sensitive data:
 * - userId: User's database ID (safe)
 * - email: User's email address (acceptable in JWT)
 * - tenantId: Tenant identifier (safe)
 * - role: User's role (safe)
 *
 * DO NOT include in payload:
 * - password or password_hash
 * - sensitive personal information (SSN, etc.)
 * - API keys or secrets
 *
 * JWTs can be decoded by anyone - only include data that's safe to expose.
 * Semgrep audit finding reviewed and accepted: Current implementation is secure.
 *
 * @param {Object} payload - Non-sensitive user data for JWT
 * @param {string} payload.userId - User ID
 * @param {string} payload.email - User email
 * @param {string} payload.tenantId - Tenant ID
 * @param {string} payload.role - User role
 * @returns {Promise<{accessToken: string, refreshToken: string}>}
 */
const generateTokens = async (payload) => {
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
  
  try {
    const redis = getRedisClient();
    const refreshKey = `refresh_token:${payload.userId}`;
    await redis.setEx(refreshKey, 30 * 24 * 60 * 60, refreshToken); // 30 days
  } catch (error) {
    logger.error('Error storing refresh token in Redis:', error);
  }
  
  return { accessToken, refreshToken };
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Access token expired');
    }
    throw new Error('Invalid access token');
  }
};

const verifyRefreshToken = async (token) => {
  try {
    const payload = jwt.verify(token, JWT_REFRESH_SECRET);
    
    const redis = getRedisClient();
    const refreshKey = `refresh_token:${payload.userId}`;
    const storedToken = await redis.get(refreshKey);
    
    if (storedToken !== token) {
      throw new Error('Invalid refresh token');
    }
    
    return payload;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Refresh token expired');
    }
    throw new Error('Invalid refresh token');
  }
};

const revokeRefreshToken = async (userId) => {
  try {
    const redis = getRedisClient();
    const refreshKey = `refresh_token:${userId}`;
    await redis.del(refreshKey);
  } catch (error) {
    logger.error('Error revoking refresh token:', error);
  }
};

const refreshAccessToken = async (refreshToken) => {
  const payload = await verifyRefreshToken(refreshToken);
  
  const newPayload = {
    userId: payload.userId,
    tenantId: payload.tenantId,
    email: payload.email,
    role: payload.role
  };
  
  const { accessToken } = await generateTokens(newPayload);
  return accessToken;
};

module.exports = {
  hashPassword,
  verifyPassword,
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
  revokeRefreshToken,
  refreshAccessToken
};