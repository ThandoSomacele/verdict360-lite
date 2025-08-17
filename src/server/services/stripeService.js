const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { getDatabase } = require('../config/db');
const logger = require('../utils/logger');

class StripeService {
  constructor() {
    this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    // South African specific pricing (in ZAR cents)
    this.pricingPlans = {
      basic: {
        id: 'basic',
        name: 'Basic Plan',
        price: 29900, // R299.00 per month
        currency: 'zar',
        interval: 'month',
        features: [
          'Up to 500 conversations per month',
          'Email support',
          'Basic analytics',
          'Standard AI responses'
        ]
      },
      pro: {
        id: 'pro', 
        name: 'Professional Plan',
        price: 59900, // R599.00 per month
        currency: 'zar',
        interval: 'month',
        features: [
          'Up to 2,000 conversations per month',
          'Priority support',
          'Advanced analytics',
          'Custom branding',
          'Calendar integration',
          'Attorney notifications'
        ]
      },
      enterprise: {
        id: 'enterprise',
        name: 'Enterprise Plan', 
        price: 129900, // R1,299.00 per month
        currency: 'zar',
        interval: 'month',
        features: [
          'Unlimited conversations',
          '24/7 phone support',
          'Full analytics suite',
          'White-label solution',
          'API access',
          'Custom integrations',
          'Dedicated account manager'
        ]
      }
    };
  }

  /**
   * Create a new customer in Stripe
   */
  async createCustomer(tenantData, adminUser) {
    try {
      const customer = await stripe.customers.create({
        email: adminUser.email,
        name: `${adminUser.firstName} ${adminUser.lastName}`,
        description: `${tenantData.name} - Verdict 360 Legal Chatbot`,
        metadata: {
          tenant_id: tenantData.id,
          tenant_name: tenantData.name,
          admin_user_id: adminUser.id,
          country: 'ZA'
        },
        address: {
          country: 'ZA',
          line1: tenantData.address || '',
          city: 'Johannesburg', // Default city
          postal_code: '2000'
        }
      });

      logger.info(`Stripe customer created: ${customer.id} for tenant ${tenantData.id}`);
      return customer;
    } catch (error) {
      logger.error('Failed to create Stripe customer:', error);
      throw error;
    }
  }

  /**
   * Create subscription for a tenant
   */
  async createSubscription(customerId, planId, tenantId) {
    try {
      const plan = this.pricingPlans[planId];
      if (!plan) {
        throw new Error(`Invalid plan: ${planId}`);
      }

      // Create or get the price object
      const price = await this.createOrGetPrice(plan);

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price: price.id,
        }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription'
        },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          tenant_id: tenantId,
          plan_id: planId,
          country: 'ZA'
        },
        // 14-day trial for new customers
        trial_period_days: 14
      });

      logger.info(`Subscription created: ${subscription.id} for tenant ${tenantId}`);
      return subscription;
    } catch (error) {
      logger.error('Failed to create subscription:', error);
      throw error;
    }
  }

  /**
   * Create or retrieve existing price in Stripe
   */
  async createOrGetPrice(plan) {
    try {
      // Try to find existing price
      const prices = await stripe.prices.list({
        lookup_keys: [`verdict360_${plan.id}_monthly_zar`],
        expand: ['data.product']
      });

      if (prices.data.length > 0) {
        return prices.data[0];
      }

      // Create new product and price
      const product = await stripe.products.create({
        name: `Verdict 360 ${plan.name}`,
        description: `AI Legal Chatbot - ${plan.name}`,
        metadata: {
          plan_id: plan.id,
          country: 'ZA'
        }
      });

      const price = await stripe.prices.create({
        unit_amount: plan.price,
        currency: plan.currency,
        recurring: {
          interval: plan.interval
        },
        product: product.id,
        lookup_key: `verdict360_${plan.id}_monthly_zar`,
        metadata: {
          plan_id: plan.id,
          country: 'ZA'
        }
      });

      return price;
    } catch (error) {
      logger.error('Failed to create/get price:', error);
      throw error;
    }
  }

  /**
   * Update tenant subscription
   */
  async updateSubscription(subscriptionId, newPlanId) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const newPlan = this.pricingPlans[newPlanId];
      
      if (!newPlan) {
        throw new Error(`Invalid plan: ${newPlanId}`);
      }

      const newPrice = await this.createOrGetPrice(newPlan);

      const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        items: [{
          id: subscription.items.data[0].id,
          price: newPrice.id,
        }],
        proration_behavior: 'create_prorations'
      });

      logger.info(`Subscription updated: ${subscriptionId} to plan ${newPlanId}`);
      return updatedSubscription;
    } catch (error) {
      logger.error('Failed to update subscription:', error);
      throw error;
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId, cancelAtPeriodEnd = true) {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: cancelAtPeriodEnd
      });

      logger.info(`Subscription ${cancelAtPeriodEnd ? 'scheduled for cancellation' : 'cancelled'}: ${subscriptionId}`);
      return subscription;
    } catch (error) {
      logger.error('Failed to cancel subscription:', error);
      throw error;
    }
  }

  /**
   * Create billing portal session
   */
  async createBillingPortalSession(customerId, returnUrl) {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl || 'http://localhost:3000/dashboard/billing'
      });

      return session;
    } catch (error) {
      logger.error('Failed to create billing portal session:', error);
      throw error;
    }
  }

  /**
   * Create checkout session for new subscription
   */
  async createCheckoutSession(customerId, planId, tenantId, successUrl, cancelUrl) {
    try {
      const plan = this.pricingPlans[planId];
      if (!plan) {
        throw new Error(`Invalid plan: ${planId}`);
      }

      const price = await this.createOrGetPrice(plan);

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [{
          price: price.id,
          quantity: 1,
        }],
        mode: 'subscription',
        success_url: successUrl || `http://localhost:3000/dashboard/billing?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || 'http://localhost:3000/dashboard/billing',
        metadata: {
          tenant_id: tenantId,
          plan_id: planId
        },
        subscription_data: {
          trial_period_days: 14,
          metadata: {
            tenant_id: tenantId,
            plan_id: planId,
            country: 'ZA'
          }
        }
      });

      return session;
    } catch (error) {
      logger.error('Failed to create checkout session:', error);
      throw error;
    }
  }

  /**
   * Handle Stripe webhooks
   */
  async handleWebhook(rawBody, signature) {
    try {
      const event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        this.webhookSecret
      );

      logger.info(`Processing webhook: ${event.type}`);

      switch (event.type) {
        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object);
          break;
        
        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;
        
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object);
          break;
        
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object);
          break;
        
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object);
          break;
        
        case 'checkout.session.completed':
          await this.handleCheckoutCompleted(event.data.object);
          break;
        
        default:
          logger.info(`Unhandled webhook event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      logger.error('Webhook error:', error);
      throw error;
    }
  }

  /**
   * Handle successful payment
   */
  async handlePaymentSucceeded(invoice) {
    try {
      const subscriptionId = invoice.subscription;
      const customerId = invoice.customer;
      const tenantId = invoice.metadata?.tenant_id;

      if (tenantId) {
        const db = getDatabase();
        await db('tenants')
          .where({ id: tenantId })
          .update({
            subscription_status: 'active',
            updated_at: db.fn.now()
          });

        logger.info(`Payment succeeded for tenant ${tenantId}`);
      }
    } catch (error) {
      logger.error('Error handling payment succeeded:', error);
    }
  }

  /**
   * Handle failed payment
   */
  async handlePaymentFailed(invoice) {
    try {
      const tenantId = invoice.metadata?.tenant_id;

      if (tenantId) {
        const db = getDatabase();
        await db('tenants')
          .where({ id: tenantId })
          .update({
            subscription_status: 'past_due',
            updated_at: db.fn.now()
          });

        logger.info(`Payment failed for tenant ${tenantId}`);
      }
    } catch (error) {
      logger.error('Error handling payment failed:', error);
    }
  }

  /**
   * Handle subscription created
   */
  async handleSubscriptionCreated(subscription) {
    try {
      const tenantId = subscription.metadata?.tenant_id;
      const planId = subscription.metadata?.plan_id;

      if (tenantId) {
        const db = getDatabase();
        await db('tenants')
          .where({ id: tenantId })
          .update({
            stripe_subscription_id: subscription.id,
            subscription_status: subscription.status === 'trialing' ? 'trial' : 'active',
            trial_ends_at: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
            updated_at: db.fn.now()
          });

        logger.info(`Subscription created for tenant ${tenantId}: ${subscription.id}`);
      }
    } catch (error) {
      logger.error('Error handling subscription created:', error);
    }
  }

  /**
   * Handle subscription updated
   */
  async handleSubscriptionUpdated(subscription) {
    try {
      const tenantId = subscription.metadata?.tenant_id;

      if (tenantId) {
        const db = getDatabase();
        await db('tenants')
          .where({ id: tenantId })
          .update({
            subscription_status: subscription.status,
            updated_at: db.fn.now()
          });

        logger.info(`Subscription updated for tenant ${tenantId}: ${subscription.status}`);
      }
    } catch (error) {
      logger.error('Error handling subscription updated:', error);
    }
  }

  /**
   * Handle subscription deleted/cancelled
   */
  async handleSubscriptionDeleted(subscription) {
    try {
      const tenantId = subscription.metadata?.tenant_id;

      if (tenantId) {
        const db = getDatabase();
        await db('tenants')
          .where({ id: tenantId })
          .update({
            subscription_status: 'canceled',
            updated_at: db.fn.now()
          });

        logger.info(`Subscription cancelled for tenant ${tenantId}`);
      }
    } catch (error) {
      logger.error('Error handling subscription deleted:', error);
    }
  }

  /**
   * Handle checkout session completed
   */
  async handleCheckoutCompleted(session) {
    try {
      const tenantId = session.metadata?.tenant_id;
      const subscriptionId = session.subscription;

      if (tenantId && subscriptionId) {
        const db = getDatabase();
        await db('tenants')
          .where({ id: tenantId })
          .update({
            stripe_subscription_id: subscriptionId,
            subscription_status: 'active',
            updated_at: db.fn.now()
          });

        logger.info(`Checkout completed for tenant ${tenantId}`);
      }
    } catch (error) {
      logger.error('Error handling checkout completed:', error);
    }
  }

  /**
   * Get pricing plans
   */
  getPricingPlans() {
    return this.pricingPlans;
  }

  /**
   * Format price for South African Rand
   */
  formatPrice(amountInCents) {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amountInCents / 100);
  }

  /**
   * Get subscription details
   */
  async getSubscriptionDetails(subscriptionId) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['default_payment_method', 'items.data.price.product']
      });

      return subscription;
    } catch (error) {
      logger.error('Failed to get subscription details:', error);
      throw error;
    }
  }

  /**
   * Get customer details
   */
  async getCustomerDetails(customerId) {
    try {
      const customer = await stripe.customers.retrieve(customerId);
      return customer;
    } catch (error) {
      logger.error('Failed to get customer details:', error);
      throw error;
    }
  }
}

module.exports = new StripeService();