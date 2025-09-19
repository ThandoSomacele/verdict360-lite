import Stripe from 'stripe';
import { db } from '$lib/config/database';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia'
});

// South African pricing tiers in ZAR
export const PRICING_PLANS = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 199900, // R1,999 in cents
    priceDisplay: 'R1,999',
    currency: 'zar',
    features: [
      'Up to 100 leads/month',
      '1 AI Assistant',
      'Email support',
      'Basic analytics',
      'Standard templates'
    ],
    limits: {
      leadsPerMonth: 100,
      assistants: 1,
      users: 2
    }
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    price: 499900, // R4,999 in cents
    priceDisplay: 'R4,999',
    currency: 'zar',
    features: [
      'Up to 500 leads/month',
      '3 AI Assistants',
      'Priority email & phone support',
      'Advanced analytics',
      'Custom templates',
      'Calendar integration',
      'API access'
    ],
    limits: {
      leadsPerMonth: 500,
      assistants: 3,
      users: 10
    }
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 999900, // R9,999 in cents
    priceDisplay: 'R9,999',
    currency: 'zar',
    features: [
      'Unlimited leads',
      'Unlimited AI Assistants',
      'Dedicated support',
      'Custom analytics',
      'White-label options',
      'Custom integrations',
      'SLA guarantee',
      'Training included'
    ],
    limits: {
      leadsPerMonth: -1, // Unlimited
      assistants: -1,
      users: -1
    }
  }
};

export class StripeService {
  /**
   * Create a Stripe customer for a tenant
   */
  async createCustomer(data: {
    email: string;
    name: string;
    tenantId: string;
    phone?: string;
    vatNumber?: string; // For South African VAT
  }): Promise<Stripe.Customer> {
    try {
      const customer = await stripe.customers.create({
        email: data.email,
        name: data.name,
        phone: data.phone,
        metadata: {
          tenantId: data.tenantId,
          vatNumber: data.vatNumber || ''
        },
        address: {
          country: 'ZA' // South Africa
        }
      });

      // Store customer ID in database
      await db('tenants')
        .where('id', data.tenantId)
        .update({
          stripe_customer_id: customer.id,
          updated_at: new Date()
        });

      return customer;
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw error;
    }
  }

  /**
   * Create a subscription for a tenant
   */
  async createSubscription(data: {
    customerId: string;
    planId: string;
    tenantId: string;
  }): Promise<Stripe.Subscription> {
    try {
      const plan = PRICING_PLANS[data.planId as keyof typeof PRICING_PLANS];
      if (!plan) {
        throw new Error('Invalid plan ID');
      }

      // Create or retrieve price
      let price = await this.getOrCreatePrice(plan);

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: data.customerId,
        items: [{ price: price.id }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription'
        },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          tenantId: data.tenantId,
          planId: data.planId
        },
        currency: 'zar'
      });

      // Update tenant billing status
      await db('tenants')
        .where('id', data.tenantId)
        .update({
          stripe_subscription_id: subscription.id,
          subscription_plan: data.planId,
          subscription_status: subscription.status,
          updated_at: new Date()
        });

      return subscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  /**
   * Create checkout session for new subscription
   */
  async createCheckoutSession(data: {
    customerId: string;
    planId: string;
    tenantId: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<Stripe.Checkout.Session> {
    try {
      const plan = PRICING_PLANS[data.planId as keyof typeof PRICING_PLANS];
      if (!plan) {
        throw new Error('Invalid plan ID');
      }

      const price = await this.getOrCreatePrice(plan);

      const session = await stripe.checkout.sessions.create({
        customer: data.customerId,
        payment_method_types: ['card'],
        line_items: [{
          price: price.id,
          quantity: 1
        }],
        mode: 'subscription',
        success_url: data.successUrl,
        cancel_url: data.cancelUrl,
        currency: 'zar',
        metadata: {
          tenantId: data.tenantId,
          planId: data.planId
        },
        subscription_data: {
          metadata: {
            tenantId: data.tenantId,
            planId: data.planId
          }
        },
        // Enable South African payment methods
        payment_method_options: {
          card: {
            request_three_d_secure: 'automatic'
          }
        },
        billing_address_collection: 'required',
        tax_id_collection: {
          enabled: true // For VAT numbers
        }
      });

      return session;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true
      });

      // Update tenant status
      const tenant = await db('tenants')
        .where('stripe_subscription_id', subscriptionId)
        .first();

      if (tenant) {
        await db('tenants')
          .where('id', tenant.id)
          .update({
            subscription_status: 'canceling',
            updated_at: new Date()
          });
      }

      return subscription;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  /**
   * Handle webhook events
   */
  async handleWebhook(event: Stripe.Event): Promise<void> {
    try {
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated': {
          const subscription = event.data.object as Stripe.Subscription;
          await this.updateSubscriptionStatus(subscription);
          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          await db('tenants')
            .where('stripe_subscription_id', subscription.id)
            .update({
              subscription_status: 'canceled',
              subscription_end_date: new Date(),
              updated_at: new Date()
            });
          break;
        }

        case 'invoice.payment_succeeded': {
          const invoice = event.data.object as Stripe.Invoice;
          await this.recordPayment(invoice);
          break;
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object as Stripe.Invoice;
          await this.handleFailedPayment(invoice);
          break;
        }
      }
    } catch (error) {
      console.error('Error handling webhook:', error);
      throw error;
    }
  }

  /**
   * Get or create a price for a plan
   */
  private async getOrCreatePrice(plan: typeof PRICING_PLANS.starter): Promise<Stripe.Price> {
    try {
      // Check if price already exists
      const prices = await stripe.prices.list({
        lookup_keys: [`${plan.id}_monthly_zar`],
        limit: 1
      });

      if (prices.data.length > 0) {
        return prices.data[0];
      }

      // Create product if doesn't exist
      const products = await stripe.products.list({
        limit: 100
      });

      let product = products.data.find(p => p.metadata.planId === plan.id);

      if (!product) {
        product = await stripe.products.create({
          name: `Verdict 360 ${plan.name}`,
          description: `${plan.name} subscription plan`,
          metadata: {
            planId: plan.id
          }
        });
      }

      // Create price
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.price,
        currency: 'zar',
        recurring: {
          interval: 'month'
        },
        lookup_key: `${plan.id}_monthly_zar`,
        metadata: {
          planId: plan.id
        }
      });

      return price;
    } catch (error) {
      console.error('Error creating price:', error);
      throw error;
    }
  }

  /**
   * Update subscription status in database
   */
  private async updateSubscriptionStatus(subscription: Stripe.Subscription): Promise<void> {
    const planId = subscription.metadata.planId || 'starter';

    await db('tenants')
      .where('stripe_subscription_id', subscription.id)
      .update({
        subscription_status: subscription.status,
        subscription_plan: planId,
        subscription_current_period_end: new Date(subscription.current_period_end * 1000),
        updated_at: new Date()
      });
  }

  /**
   * Record successful payment
   */
  private async recordPayment(invoice: Stripe.Invoice): Promise<void> {
    await db('billing_history').insert({
      tenant_id: invoice.metadata?.tenantId,
      invoice_id: invoice.id,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: 'paid',
      paid_at: new Date(invoice.status_transitions.paid_at! * 1000),
      invoice_url: invoice.hosted_invoice_url,
      created_at: new Date()
    });
  }

  /**
   * Handle failed payment
   */
  private async handleFailedPayment(invoice: Stripe.Invoice): Promise<void> {
    await db('billing_history').insert({
      tenant_id: invoice.metadata?.tenantId,
      invoice_id: invoice.id,
      amount: invoice.amount_due,
      currency: invoice.currency,
      status: 'failed',
      created_at: new Date()
    });

    // Send notification email
    // TODO: Implement email notification
  }

  /**
   * Get usage statistics for billing
   */
  async getUsageStats(tenantId: string, startDate: Date, endDate: Date) {
    const leadCount = await db('chat_leads')
      .where('tenant_id', tenantId)
      .whereBetween('created_at', [startDate, endDate])
      .count('id as count')
      .first();

    const conversationCount = await db('conversations')
      .where('tenant_id', tenantId)
      .whereBetween('created_at', [startDate, endDate])
      .count('id as count')
      .first();

    return {
      leads: leadCount?.count || 0,
      conversations: conversationCount?.count || 0
    };
  }
}

export const stripeService = new StripeService();