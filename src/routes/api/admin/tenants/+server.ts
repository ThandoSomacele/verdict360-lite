import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/config/database';
import { getTenantsWithStats } from '$lib/server/seedDataServer';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const page = parseInt(url.searchParams.get('page') || '1');
    const status = url.searchParams.get('status') || 'all';
    const plan = url.searchParams.get('plan') || 'all';
    const search = url.searchParams.get('search') || '';
    const limit = 10;
    const offset = (page - 1) * limit;

    let tenants: any[] = [];
    let totalCount = 0;

    // Try to get real tenants from database
    try {
      tenants = await db('tenants')
        .select('*')
        .orderBy('created_at', 'desc')
        .limit(limit)
        .offset(offset);

      const countResult = await db('tenants').count('id as count').first();
      totalCount = parseInt(countResult?.count as string) || 0;
    } catch (dbError) {
      // Database not available, use server-side seed data
      let allTenants = getTenantsWithStats();

      // Apply filters
      if (status !== 'all') {
        allTenants = allTenants.filter(t => t.subscription_status === status);
      }
      if (plan !== 'all') {
        allTenants = allTenants.filter(t => t.subscription_plan === plan);
      }
      if (search) {
        const searchLower = search.toLowerCase();
        allTenants = allTenants.filter(t =>
          t.name.toLowerCase().includes(searchLower) ||
          t.subdomain.toLowerCase().includes(searchLower)
        );
      }

      // Sort by created_at desc
      allTenants.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      totalCount = allTenants.length;

      // Apply pagination
      tenants = allTenants.slice(offset, offset + limit);
    }

    return json({
      tenants,
      total: totalCount,
      page,
      limit
    });
  } catch (error) {
    console.error('Failed to fetch tenants:', error);

    return json({
      tenants: [],
      total: 0,
      page: 1,
      limit: 10
    }, { status: 500 });
  }
};