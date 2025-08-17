const { RateLimiterRedis } = require('rate-limiter-flexible');
const { getRedisClient } = require('../config/redis');
const logger = require('../utils/logger');

const rateLimiters = {};

const createRateLimiter = (keyPrefix, points, duration) => {
  if (!rateLimiters[keyPrefix]) {
    try {
      const redisClient = getRedisClient();
      rateLimiters[keyPrefix] = new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix,
        points,
        duration,
        blockDuration: duration,
      });
    } catch (error) {
      logger.warn('Redis not available for rate limiting, using memory fallback');
      const { RateLimiterMemory } = require('rate-limiter-flexible');
      rateLimiters[keyPrefix] = new RateLimiterMemory({
        keyPrefix,
        points,
        duration,
        blockDuration: duration,
      });
    }
  }
  return rateLimiters[keyPrefix];
};

const globalRateLimit = async (req, res, next) => {
  try {
    const limiter = createRateLimiter(
      'global',
      parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
      parseInt(process.env.RATE_LIMIT_WINDOW_MS) / 1000 || 900 // Convert to seconds
    );
    
    const key = req.ip;
    await limiter.consume(key);
    
    next();
  } catch (rateLimiterRes) {
    const remainingPoints = rateLimiterRes.remainingPoints || 0;
    const msBeforeNext = rateLimiterRes.msBeforeNext || 0;
    
    res.set({
      'Retry-After': Math.round(msBeforeNext / 1000) || 1,
      'X-RateLimit-Limit': parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
      'X-RateLimit-Remaining': remainingPoints,
      'X-RateLimit-Reset': new Date(Date.now() + msBeforeNext).toISOString(),
    });
    
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: Math.round(msBeforeNext / 1000) || 1
    });
  }
};

const tenantRateLimit = (points = 1000, duration = 3600) => {
  return async (req, res, next) => {
    try {
      if (!req.tenant) {
        return next();
      }
      
      const limiter = createRateLimiter(
        `tenant_${req.tenant.id}`,
        points,
        duration
      );
      
      await limiter.consume(req.tenant.id);
      next();
    } catch (rateLimiterRes) {
      const remainingPoints = rateLimiterRes.remainingPoints || 0;
      const msBeforeNext = rateLimiterRes.msBeforeNext || 0;
      
      res.set({
        'Retry-After': Math.round(msBeforeNext / 1000) || 1,
        'X-RateLimit-Limit': points,
        'X-RateLimit-Remaining': remainingPoints,
        'X-RateLimit-Reset': new Date(Date.now() + msBeforeNext).toISOString(),
      });
      
      logger.warn(`Tenant rate limit exceeded: ${req.tenant.subdomain}`);
      res.status(429).json({
        error: 'Tenant rate limit exceeded',
        retryAfter: Math.round(msBeforeNext / 1000) || 1
      });
    }
  };
};

const authRateLimit = async (req, res, next) => {
  try {
    const limiter = createRateLimiter(
      'auth',
      5, // 5 attempts
      300 // 5 minutes
    );
    
    const key = `${req.ip}_${req.body.email || 'unknown'}`;
    await limiter.consume(key);
    
    next();
  } catch (rateLimiterRes) {
    const msBeforeNext = rateLimiterRes.msBeforeNext || 0;
    
    logger.warn(`Auth rate limit exceeded for: ${req.ip}`);
    res.status(429).json({
      error: 'Too many authentication attempts',
      retryAfter: Math.round(msBeforeNext / 1000) || 1
    });
  }
};

const chatRateLimit = async (req, res, next) => {
  try {
    const limiter = createRateLimiter(
      'chat',
      50, // 50 messages
      300 // 5 minutes
    );
    
    const key = req.tenant ? `${req.tenant.id}_${req.ip}` : req.ip;
    await limiter.consume(key);
    
    next();
  } catch (rateLimiterRes) {
    const msBeforeNext = rateLimiterRes.msBeforeNext || 0;
    
    logger.warn(`Chat rate limit exceeded for: ${req.ip}`);
    res.status(429).json({
      error: 'Too many chat messages',
      retryAfter: Math.round(msBeforeNext / 1000) || 1
    });
  }
};

module.exports = {
  globalRateLimit,
  tenantRateLimit,
  authRateLimit,
  chatRateLimit
};