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
      let query = db('tenants').select('*');

      // Apply search filter
      if (search) {
        const searchLower = search.toLowerCase();
        query = query.where(function() {
          this.whereRaw('LOWER(name) LIKE ?', [`%${searchLower}%`])
            .orWhereRaw('LOWER(subdomain) LIKE ?', [`%${searchLower}%`])
            .orWhereRaw('LOWER(email) LIKE ?', [`%${searchLower}%`]);
        });
      }

      // Apply status filter
      if (status !== 'all') {
        query = query.where('subscription_status', status);
      }

      // Apply plan filter
      if (plan !== 'all') {
        query = query.where('subscription_plan', plan);
      }

      const dbTenants = await query
        .orderBy('created_at', 'desc')
        .limit(limit)
        .offset(offset);

      // Map database tenants to include all required fields with proper field names
      tenants = dbTenants.map(tenant => ({
        id: tenant.id,
        name: tenant.name,
        subdomain: tenant.subdomain,
        email: tenant.email || `admin@${tenant.subdomain}.verdict360.com`,
        phone: tenant.phone || '+27 11 000 0000',
        // Both formats for compatibility
        status: tenant.subscription_status,
        subscription_status: tenant.subscription_status,
        plan: tenant.subscription_plan ?
          (tenant.subscription_plan.charAt(0).toUpperCase() + tenant.subscription_plan.slice(1)) :
          'Basic',
        subscription_plan: tenant.subscription_plan || 'basic',
        userCount: tenant.max_users || 5,
        user_count: tenant.max_users || 0,
        conversation_count: 0, // TODO: Join with conversations table
        mrr: tenant.subscription_status === 'active' ?
          (tenant.subscription_plan === 'pro' ? 7999 :
           tenant.subscription_plan === 'enterprise' ? 24999 : 2999) : 0,
        createdAt: tenant.created_at,
        created_at: tenant.created_at,
        trial_ends_at: tenant.trial_ends_at
      }));

      // Get total count with same filters
      let countQuery = db('tenants');

      if (search) {
        const searchLower = search.toLowerCase();
        countQuery = countQuery.where(function() {
          this.whereRaw('LOWER(name) LIKE ?', [`%${searchLower}%`])
            .orWhereRaw('LOWER(subdomain) LIKE ?', [`%${searchLower}%`])
            .orWhereRaw('LOWER(email) LIKE ?', [`%${searchLower}%`]);
        });
      }

      if (status !== 'all') {
        countQuery = countQuery.where('subscription_status', status);
      }

      if (plan !== 'all') {
        countQuery = countQuery.where('subscription_plan', plan);
      }

      const countResult = await countQuery.count('id as count').first();
      totalCount = parseInt(countResult?.count as string) || 0;
    } catch (dbError) {
      // Database not available, use server-side seed data
      console.error('Database error in tenants API:', dbError);
      console.log('Using seed data for tenants');
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