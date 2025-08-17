const { getDatabase } = require('../config/db');
const logger = require('../utils/logger');

/**
 * Middleware to check if tenant has an active subscription
 */
const requireActiveSubscription = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    
    if (!tenantId) {
      return res.status(401).json({
        success: false,
        message: 'No tenant access'
      });
    }

    const db = getDatabase();
    const tenant = await db('tenants').where({ id: tenantId }).first();
    
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    // Check subscription status
    const status = tenant.subscription_status;
    const trialEndsAt = tenant.trial_ends_at;
    const now = new Date();

    // Allow access if:
    // 1. Subscription is active
    // 2. Subscription is trialing and trial hasn't expired
    // 3. Grace period for past_due status (24 hours)
    const hasActiveSubscription = 
      status === 'active' ||
      (status === 'trialing' && trialEndsAt && new Date(trialEndsAt) > now) ||
      (status === 'past_due'); // Allow grace period

    if (!hasActiveSubscription) {
      return res.status(402).json({
        success: false,
        message: 'Active subscription required',
        code: 'SUBSCRIPTION_REQUIRED',
        subscription_status: status,
        trial_ends_at: trialEndsAt
      });
    }

    // Add subscription info to request
    req.subscription = {
      status,
      trial_ends_at: trialEndsAt,
      is_trial: status === 'trialing',
      is_active: status === 'active',
      needs_payment: status === 'past_due'
    };

    next();
  } catch (error) {
    logger.error('Error checking subscription status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify subscription'
    });
  }
};

/**
 * Middleware to check usage limits based on subscription plan
 */
const checkUsageLimits = (resourceType) => {
  return async (req, res, next) => {
    try {
      const { tenantId } = req.user;
      const { subscription } = req;
      
      if (!subscription) {
        return res.status(500).json({
          success: false,
          message: 'Subscription data not available'
        });
      }

      const db = getDatabase();
      const tenant = await db('tenants').where({ id: tenantId }).first();
      
      // Get current month's usage
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      let currentUsage = 0;
      let limit = 0;

      // Check usage based on resource type
      switch (resourceType) {
        case 'conversations':
          // Count conversations this month
          currentUsage = await db('conversations')
            .where('tenant_id', tenantId)
            .where('created_at', '>=', startOfMonth)
            .count('id as count')
            .first()
            .then(result => parseInt(result.count));

          // Set limits based on subscription
          if (subscription.status === 'trialing' || !tenant.subscription_plan) {
            limit = 500; // Basic plan limits during trial
          } else {
            const planLimits = {
              basic: 500,
              pro: 2000,
              enterprise: Infinity
            };
            limit = planLimits[tenant.subscription_plan] || 500;
          }
          break;

        case 'email_notifications':
          // Count emails sent this month
          currentUsage = await db('email_logs')
            .where('tenant_id', tenantId)
            .where('created_at', '>=', startOfMonth)
            .where('status', 'sent')
            .count('id as count')
            .first()
            .then(result => parseInt(result.count));

          // Email limits
          const emailLimits = {
            basic: 1000,
            pro: 5000,
            enterprise: Infinity
          };
          limit = emailLimits[tenant.subscription_plan] || 1000;
          break;

        default:
          return next(); // No limits for unknown resource types
      }

      // Check if limit exceeded
      if (currentUsage >= limit) {
        return res.status(429).json({
          success: false,
          message: `${resourceType} limit exceeded for current plan`,
          code: 'USAGE_LIMIT_EXCEEDED',
          current_usage: currentUsage,
          limit: limit === Infinity ? 'unlimited' : limit,
          resource_type: resourceType
        });
      }

      // Add usage info to request
      req.usage = {
        [resourceType]: {
          current: currentUsage,
          limit: limit === Infinity ? 'unlimited' : limit,
          percentage: limit === Infinity ? 0 : Math.round((currentUsage / limit) * 100)
        }
      };

      next();
    } catch (error) {
      logger.error('Error checking usage limits:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check usage limits'
      });
    }
  };
};

/**
 * Middleware to add subscription and usage info to responses
 */
const addBillingInfo = async (req, res, next) => {
  try {
    if (!req.user || !req.user.tenantId) {
      return next();
    }

    const { tenantId } = req.user;
    const db = getDatabase();
    const tenant = await db('tenants').where({ id: tenantId }).first();
    
    if (!tenant) {
      return next();
    }

    // Add billing context to request
    req.billing = {
      subscription_status: tenant.subscription_status,
      subscription_plan: tenant.subscription_plan,
      trial_ends_at: tenant.trial_ends_at,
      stripe_customer_id: tenant.stripe_customer_id,
      stripe_subscription_id: tenant.stripe_subscription_id
    };

    next();
  } catch (error) {
    logger.error('Error adding billing info:', error);
    next(); // Continue even if billing info fails
  }
};

/**
 * Middleware to track feature usage for analytics
 */
const trackFeatureUsage = (featureName) => {
  return async (req, res, next) => {
    try {
      const { tenantId } = req.user;
      
      if (!tenantId) {
        return next();
      }

      // Track usage asynchronously (don't block request)
      setImmediate(async () => {
        try {
          const db = getDatabase();
          await db('feature_usage').insert({
            tenant_id: tenantId,
            feature_name: featureName,
            used_at: db.fn.now(),
            metadata: JSON.stringify({
              user_id: req.user.userId,
              ip_address: req.ip,
              user_agent: req.get('User-Agent')
            })
          }).onConflict().ignore(); // Ignore if tracking table doesn't exist
        } catch (error) {
          logger.error('Error tracking feature usage:', error);
        }
      });

      next();
    } catch (error) {
      logger.error('Error in feature tracking middleware:', error);
      next(); // Continue even if tracking fails
    }
  };
};

/**
 * Middleware to handle subscription-based feature access
 */
const requireFeature = (featureName) => {
  return async (req, res, next) => {
    try {
      const { tenantId } = req.user;
      const db = getDatabase();
      const tenant = await db('tenants').where({ id: tenantId }).first();
      
      if (!tenant) {
        return res.status(404).json({
          success: false,
          message: 'Tenant not found'
        });
      }

      const plan = tenant.subscription_plan || 'basic';
      const status = tenant.subscription_status;

      // Feature access matrix
      const featureAccess = {
        basic: ['chatbot', 'email_notifications', 'basic_analytics'],
        pro: ['chatbot', 'email_notifications', 'basic_analytics', 'calendar_integration', 'custom_branding', 'advanced_analytics'],
        enterprise: ['chatbot', 'email_notifications', 'basic_analytics', 'calendar_integration', 'custom_branding', 'advanced_analytics', 'api_access', 'white_label', 'priority_support']
      };

      // Allow all features during trial
      if (status === 'trialing') {
        return next();
      }

      // Check if feature is available for current plan
      const availableFeatures = featureAccess[plan] || featureAccess.basic;
      
      if (!availableFeatures.includes(featureName)) {
        return res.status(403).json({
          success: false,
          message: `Feature '${featureName}' not available in ${plan} plan`,
          code: 'FEATURE_NOT_AVAILABLE',
          current_plan: plan,
          required_plans: Object.keys(featureAccess).filter(p => 
            featureAccess[p].includes(featureName)
          )
        });
      }

      next();
    } catch (error) {
      logger.error('Error checking feature access:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to verify feature access'
      });
    }
  };
};

module.exports = {
  requireActiveSubscription,
  checkUsageLimits,
  addBillingInfo,
  trackFeatureUsage,
  requireFeature
};