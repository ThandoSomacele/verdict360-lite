const { verifyAccessToken } = require('../utils/auth');
const logger = require('../utils/logger');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }
    
    const payload = verifyAccessToken(token);
    
    req.user = {
      id: payload.userId,
      tenantId: payload.tenantId,
      email: payload.email,
      role: payload.role
    };
    
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
    if (error.message === 'Access token expired') {
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

const requireTenantAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (!req.tenant) {
    return res.status(400).json({ error: 'Tenant context required' });
  }
  
  if (req.user.tenantId !== req.tenant.id) {
    return res.status(403).json({ error: 'Access denied to this tenant' });
  }
  
  next();
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
      const payload = verifyAccessToken(token);
      req.user = {
        id: payload.userId,
        tenantId: payload.tenantId,
        email: payload.email,
        role: payload.role
      };
    }
    
    next();
  } catch (error) {
    logger.warn('Optional auth failed:', error.message);
    next();
  }
};

module.exports = {
  authenticateToken,
  requireRole,
  requireTenantAccess,
  optionalAuth
};