const express = require('express');
const router = express.Router();
const stripeService = require('../services/stripeService');
const { authenticateToken, requireTenantAccess } = require('../middleware/auth');
const { getDatabase } = require('../config/db');
const logger = require('../utils/logger');

/**
 * Get pricing plans for South Africa
 */
router.get('/plans', (req, res) => {
  try {
    const plans = stripeService.getPricingPlans();
    
    // Format prices for display
    const formattedPlans = Object.keys(plans).map(key => ({
      ...plans[key],
      formattedPrice: stripeService.formatPrice(plans[key].price)
    }));

    res.json({
      success: true,
      plans: formattedPlans,
      currency: 'ZAR',
      country: 'South Africa'
    });
  } catch (error) {
    logger.error('Error fetching pricing plans:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pricing plans'
    });
  }
});

/**
 * Create Stripe customer for tenant
 */
router.post('/customer', authenticateToken, requireTenantAccess, async (req, res) => {
  try {
    const { tenantId } = req.user;
    const db = getDatabase();
    
    // Get tenant and admin user data
    const tenant = await db('tenants').where({ id: tenantId }).first();
    const adminUser = await db('users').where({ 
      id: req.user.userId,
      tenant_id: tenantId 
    }).first();

    if (!tenant || !adminUser) {
      return res.status(404).json({
        success: false,
        message: 'Tenant or user not found'
      });
    }

    // Check if customer already exists
    if (tenant.stripe_customer_id) {
      const customer = await stripeService.getCustomerDetails(tenant.stripe_customer_id);
      return res.json({
        success: true,
        customer: {
          id: customer.id,
          email: customer.email,
          name: customer.name
        }
      });
    }

    // Create new Stripe customer
    const customer = await stripeService.createCustomer(tenant, adminUser);
    
    // Update tenant with customer ID
    await db('tenants')
      .where({ id: tenantId })
      .update({
        stripe_customer_id: customer.id,
        updated_at: db.fn.now()
      });

    res.json({
      success: true,
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name
      }
    });
  } catch (error) {
    logger.error('Error creating Stripe customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create customer account'
    });
  }
});

/**
 * Create checkout session for subscription
 */
router.post('/checkout', authenticateToken, requireTenantAccess, async (req, res) => {
  try {
    const { planId } = req.body;
    const { tenantId } = req.user;
    
    if (!planId) {
      return res.status(400).json({
        success: false,
        message: 'Plan ID is required'
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

    // Ensure customer exists
    let customerId = tenant.stripe_customer_id;
    if (!customerId) {
      const adminUser = await db('users').where({ 
        id: req.user.userId,
        tenant_id: tenantId 
      }).first();
      
      const customer = await stripeService.createCustomer(tenant, adminUser);
      customerId = customer.id;
      
      await db('tenants')
        .where({ id: tenantId })
        .update({
          stripe_customer_id: customerId,
          updated_at: db.fn.now()
        });
    }

    // Create checkout session
    const session = await stripeService.createCheckoutSession(
      customerId,
      planId,
      tenantId,
      `${req.protocol}://${req.get('host')}/dashboard/billing?success=true`,
      `${req.protocol}://${req.get('host')}/dashboard/billing?canceled=true`
    );

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    logger.error('Error creating checkout session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create checkout session'
    });
  }
});

/**
 * Create billing portal session
 */
router.post('/portal', authenticateToken, requireTenantAccess, async (req, res) => {
  try {
    const { tenantId } = req.user;
    const db = getDatabase();
    
    const tenant = await db('tenants').where({ id: tenantId }).first();
    
    if (!tenant || !tenant.stripe_customer_id) {
      return res.status(404).json({
        success: false,
        message: 'No billing account found'
      });
    }

    const session = await stripeService.createBillingPortalSession(
      tenant.stripe_customer_id,
      `${req.protocol}://${req.get('host')}/dashboard/billing`
    );

    res.json({
      success: true,
      url: session.url
    });
  } catch (error) {
    logger.error('Error creating billing portal session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create billing portal session'
    });
  }
});

/**
 * Get current subscription details
 */
router.get('/subscription', authenticateToken, requireTenantAccess, async (req, res) => {
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

    let subscriptionData = {
      status: tenant.subscription_status || 'inactive',
      plan: null,
      trial_ends_at: tenant.trial_ends_at,
      current_period_end: null,
      cancel_at_period_end: false
    };

    // Get detailed subscription info from Stripe if subscription exists
    if (tenant.stripe_subscription_id) {
      try {
        const subscription = await stripeService.getSubscriptionDetails(tenant.stripe_subscription_id);
        const planId = subscription.metadata?.plan_id;
        const plans = stripeService.getPricingPlans();
        
        subscriptionData = {
          status: subscription.status,
          plan: planId && plans[planId] ? {
            ...plans[planId],
            formattedPrice: stripeService.formatPrice(plans[planId].price)
          } : null,
          trial_ends_at: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
          current_period_end: new Date(subscription.current_period_end * 1000),
          cancel_at_period_end: subscription.cancel_at_period_end
        };
      } catch (error) {
        logger.error('Error fetching subscription from Stripe:', error);
      }
    }

    res.json({
      success: true,
      subscription: subscriptionData
    });
  } catch (error) {
    logger.error('Error fetching subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription details'
    });
  }
});

/**
 * Update subscription plan
 */
router.post('/subscription/update', authenticateToken, requireTenantAccess, async (req, res) => {
  try {
    const { planId } = req.body;
    const { tenantId } = req.user;
    
    if (!planId) {
      return res.status(400).json({
        success: false,
        message: 'Plan ID is required'
      });
    }

    const db = getDatabase();
    const tenant = await db('tenants').where({ id: tenantId }).first();
    
    if (!tenant || !tenant.stripe_subscription_id) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found'
      });
    }

    const subscription = await stripeService.updateSubscription(
      tenant.stripe_subscription_id,
      planId
    );

    res.json({
      success: true,
      message: 'Subscription updated successfully',
      subscription: {
        id: subscription.id,
        status: subscription.status
      }
    });
  } catch (error) {
    logger.error('Error updating subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update subscription'
    });
  }
});

/**
 * Cancel subscription
 */
router.post('/subscription/cancel', authenticateToken, requireTenantAccess, async (req, res) => {
  try {
    const { cancelAtPeriodEnd = true } = req.body;
    const { tenantId } = req.user;
    
    const db = getDatabase();
    const tenant = await db('tenants').where({ id: tenantId }).first();
    
    if (!tenant || !tenant.stripe_subscription_id) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found'
      });
    }

    const subscription = await stripeService.cancelSubscription(
      tenant.stripe_subscription_id,
      cancelAtPeriodEnd
    );

    res.json({
      success: true,
      message: cancelAtPeriodEnd 
        ? 'Subscription will be cancelled at the end of the current period'
        : 'Subscription cancelled immediately',
      subscription: {
        id: subscription.id,
        status: subscription.status,
        cancel_at_period_end: subscription.cancel_at_period_end
      }
    });
  } catch (error) {
    logger.error('Error cancelling subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel subscription'
    });
  }
});

/**
 * Stripe webhook handler
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'];
    
    if (!signature) {
      return res.status(400).json({
        success: false,
        message: 'No signature provided'
      });
    }

    const result = await stripeService.handleWebhook(req.body, signature);
    
    res.json(result);
  } catch (error) {
    logger.error('Webhook error:', error);
    res.status(400).json({
      success: false,
      message: 'Webhook error'
    });
  }
});

/**
 * Get billing history
 */
router.get('/history', authenticateToken, requireTenantAccess, async (req, res) => {
  try {
    const { tenantId } = req.user;
    const db = getDatabase();
    
    const tenant = await db('tenants').where({ id: tenantId }).first();
    
    if (!tenant || !tenant.stripe_customer_id) {
      return res.json({
        success: true,
        invoices: []
      });
    }

    // Get invoices from Stripe
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const invoices = await stripe.invoices.list({
      customer: tenant.stripe_customer_id,
      limit: 20
    });

    const formattedInvoices = invoices.data.map(invoice => ({
      id: invoice.id,
      amount: stripeService.formatPrice(invoice.amount_paid),
      status: invoice.status,
      created: new Date(invoice.created * 1000),
      invoice_pdf: invoice.invoice_pdf,
      hosted_invoice_url: invoice.hosted_invoice_url
    }));

    res.json({
      success: true,
      invoices: formattedInvoices
    });
  } catch (error) {
    logger.error('Error fetching billing history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch billing history'
    });
  }
});

module.exports = router;