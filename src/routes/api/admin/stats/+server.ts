import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/config/database';
import { calculatePlatformStats } from '$lib/server/seedDataServer';

export const GET: RequestHandler = async () => {
  try {
    // Get stats from server-side seed data
    const stats = calculatePlatformStats();

    // Try to get real stats from database if available
    try {
      const [
        tenantCount,
        // Add more queries here when tables are ready
      ] = await Promise.all([
        db('tenants').count('id as count').first(),
      ]);

      if (tenantCount && tenantCount.count) {
        stats.total_tenants = parseInt(tenantCount.count as string);
      }
    } catch (dbError) {
      // Database not available, use seed data stats
    }

    return json(stats);
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);

    // Return default stats if error
    return json({
      total_tenants: 4,
      active_subscriptions: 1,
      trial_subscriptions: 3,
      monthly_conversations: 156,
      monthly_leads: 42,
      monthly_appointments: 18,
      monthly_revenue: 2999
    });
  }
};