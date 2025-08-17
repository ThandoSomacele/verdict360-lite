const { getDatabase } = require('../config/db');
const { getRedisClient } = require('../config/redis');
const logger = require('../utils/logger');

const TENANT_CACHE_TTL = 300; // 5 minutes

const resolveTenant = async (req, res, next) => {
  try {
    let tenantIdentifier = null;
    
    // Check for subdomain first (primary method)
    const host = req.get('host');
    if (host) {
      const hostParts = host.split('.');
      if (hostParts.length > 2) {
        // subdomain.verdict360.com format
        tenantIdentifier = hostParts[0];
      } else if (req.headers['x-tenant-domain']) {
        // Custom domain via header
        tenantIdentifier = req.headers['x-tenant-domain'];
      }
    }
    
    // Fallback to query parameter or header for development/testing
    if (!tenantIdentifier) {
      tenantIdentifier = req.query.tenant || req.headers['x-tenant-id'];
    }
    
    // Use default tenant if none specified (for development)
    if (!tenantIdentifier) {
      tenantIdentifier = process.env.DEFAULT_TENANT || 'demo';
    }
    
    if (!tenantIdentifier) {
      return res.status(400).json({ 
        error: 'Tenant identifier required',
        hint: 'Use subdomain, x-tenant-id header, or ?tenant= query parameter'
      });
    }
    
    // Try to get tenant from cache first
    let tenant = null;
    try {
      const redis = getRedisClient();
      const cacheKey = `tenant:${tenantIdentifier}`;
      const cachedTenant = await redis.get(cacheKey);
      
      if (cachedTenant) {
        tenant = JSON.parse(cachedTenant);
        logger.debug(`Tenant ${tenantIdentifier} loaded from cache`);
      }
    } catch (redisError) {
      logger.warn('Redis cache error, falling back to database:', redisError.message);
    }
    
    // If not in cache, query database
    if (!tenant) {
      const db = getDatabase();
      tenant = await db('tenants')
        .where('subdomain', tenantIdentifier)
        .orWhere('custom_domain', tenantIdentifier)
        .first();
      
      if (!tenant) {
        return res.status(404).json({ 
          error: 'Tenant not found',
          tenant: tenantIdentifier 
        });
      }
      
      // Cache the tenant for future requests
      try {
        const redis = getRedisClient();
        const cacheKey = `tenant:${tenantIdentifier}`;
        await redis.setEx(cacheKey, TENANT_CACHE_TTL, JSON.stringify(tenant));
      } catch (redisError) {
        logger.warn('Failed to cache tenant:', redisError.message);
      }
    }
    
    // Check tenant status
    if (tenant.status !== 'active') {
      return res.status(403).json({ 
        error: 'Tenant access denied',
        status: tenant.status 
      });
    }
    
    // Check subscription status
    if (tenant.subscription_status === 'canceled') {
      return res.status(403).json({ 
        error: 'Subscription canceled',
        message: 'Please contact support to reactivate your account'
      });
    }
    
    if (tenant.subscription_status === 'past_due') {
      return res.status(402).json({ 
        error: 'Payment required',
        message: 'Please update your payment method to continue using the service'
      });
    }
    
    // Add tenant context to request
    req.tenant = {
      id: tenant.id,
      name: tenant.name,
      subdomain: tenant.subdomain,
      customDomain: tenant.custom_domain,
      branding: tenant.branding || {},
      settings: tenant.settings || {},
      status: tenant.status,
      subscriptionStatus: tenant.subscription_status,
      stripeCustomerId: tenant.stripe_customer_id,
      stripeSubscriptionId: tenant.stripe_subscription_id,
      trialEndsAt: tenant.trial_ends_at
    };
    
    logger.debug(`Tenant resolved: ${tenant.name} (${tenant.subdomain})`);
    next();
    
  } catch (error) {
    logger.error('Tenant resolution error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const clearTenantCache = async (tenantIdentifier) => {
  try {
    const redis = getRedisClient();
    const cacheKey = `tenant:${tenantIdentifier}`;
    await redis.del(cacheKey);
    logger.debug(`Cleared cache for tenant: ${tenantIdentifier}`);
  } catch (error) {
    logger.warn('Failed to clear tenant cache:', error.message);
  }
};

module.exports = {
  resolveTenant,
  clearTenantCache
};