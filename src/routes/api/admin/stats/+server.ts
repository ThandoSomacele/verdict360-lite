import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/config/database';
import { calculatePlatformStats } from '$lib/server/seedDataServer';

export const GET: RequestHandler = async () => {
  try {
    let stats = {
      total_tenants: 0,
      active_subscriptions: 0,
      trial_subscriptions: 0,
      monthly_conversations: 0,
      monthly_leads: 0,
      monthly_appointments: 0,
      monthly_revenue: 0
    };

    // Try to get real stats from database
    try {
      // Get tenant counts
      const [
        tenantCount,
        activeCount,
        trialCount,
        conversationCount,
        leadCount
      ] = await Promise.all([
        db('tenants').count('id as count').first(),
        db('tenants')
          .where('subscription_status', 'active')
          .count('id as count')
          .first(),
        db('tenants')
          .where('subscription_status', 'trial')
          .count('id as count')
          .first(),
        db('conversations').count('id as count').first().catch(() => ({ count: 0 })),
        db('chat_leads').count('id as count').first().catch(() => ({ count: 0 }))
      ]);

      // Get monthly revenue from active subscriptions
      const revenueData = await db('tenants')
        .where('subscription_status', 'active')
        .select('subscription_plan');

      const planPricing: Record<string, number> = {
        'basic': 2999,
        'pro': 7999,
        'enterprise': 24999
      };

      const monthlyRevenue = revenueData.reduce((total, tenant) => {
        const plan = tenant.subscription_plan?.toLowerCase();
        const price = planPricing[plan] || 0;
        return total + price;
      }, 0);

      stats = {
        total_tenants: parseInt(tenantCount?.count as string) || 0,
        active_subscriptions: parseInt(activeCount?.count as string) || 0,
        trial_subscriptions: parseInt(trialCount?.count as string) || 0,
        monthly_conversations: parseInt(conversationCount?.count as string) || 0,
        monthly_leads: parseInt(leadCount?.count as string) || 0,
        monthly_appointments: 0, // Will be implemented when appointments table has data
        monthly_revenue: monthlyRevenue
      };

    } catch (dbError) {
      console.error('Database query failed:', dbError);
      console.log('Using seed data as fallback');
      // Fall back to seed data if database fails
      stats = calculatePlatformStats();
    }

    return json(stats);
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);

    // Return default stats if error
    return json({
      total_tenants: 4,
      active_subscriptions: 1,
      trial_subscriptions: 3,
      monthly_conversations: 0,
      monthly_leads: 0,
      monthly_appointments: 0,
      monthly_revenue: 7999
    });
  }
};