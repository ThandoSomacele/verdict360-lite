// Server-side utility for accessing seed data
// This will be used by API endpoints since they don't have access to browser localStorage

import { defaultTenants, defaultUsers, defaultConversations, defaultLeads, defaultMessages } from '$lib/utils/seedData';

// In-memory store for seed data (simulating localStorage on server)
let serverSeedData = {
  tenants: defaultTenants,
  users: defaultUsers,
  conversations: defaultConversations,
  leads: defaultLeads,
  messages: defaultMessages
};

export function getServerTenants() {
  return serverSeedData.tenants;
}

export function getServerUsers() {
  return serverSeedData.users;
}

export function getServerConversations() {
  return serverSeedData.conversations;
}

export function getServerLeads() {
  return serverSeedData.leads;
}

export function getServerMessages() {
  return serverSeedData.messages;
}

// Helper function to calculate platform stats
export function calculatePlatformStats() {
  const tenants = serverSeedData.tenants;
  const users = serverSeedData.users;
  const conversations = serverSeedData.conversations;
  const leads = serverSeedData.leads;

  // Calculate stats
  const activeTenants = tenants.filter(t => t.status === 'active');
  const trialTenants = tenants.filter(t => t.plan === 'trial');
  const paidTenants = tenants.filter(t => ['starter', 'professional', 'enterprise'].includes(t.plan?.toLowerCase()));

  // Calculate monthly revenue based on plans
  const planPricing: Record<string, number> = {
    'starter': 2999,
    'professional': 7999,
    'enterprise': 24999
  };

  const monthlyRevenue = paidTenants.reduce((total, tenant) => {
    const price = planPricing[tenant.plan?.toLowerCase()] || 0;
    return total + price;
  }, 0);

  // Get current month's conversations
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyConversations = conversations.filter(c => {
    const createdAt = new Date(c.created_at);
    return createdAt >= startOfMonth;
  }).length;

  // Get current month's leads
  const monthlyLeads = leads.filter(l => {
    const createdAt = new Date(l.created_at);
    return createdAt >= startOfMonth;
  }).length;

  return {
    total_tenants: tenants.length,
    active_subscriptions: paidTenants.length,
    trial_subscriptions: trialTenants.length,
    monthly_conversations: monthlyConversations || 156,
    monthly_leads: monthlyLeads || 42,
    monthly_appointments: 18,
    monthly_revenue: monthlyRevenue
  };
}

// Helper function to get tenants with additional data
export function getTenantsWithStats() {
  const tenants = serverSeedData.tenants;
  const users = serverSeedData.users;
  const conversations = serverSeedData.conversations;
  const leads = serverSeedData.leads;

  return tenants.map(tenant => {
    // Count users for this tenant
    const tenantUsers = users.filter(u => u.tenant_id === tenant.id);
    const tenantConversations = conversations.filter(c => c.tenant_id === tenant.id);
    const tenantLeads = leads.filter(l => l.tenant_id === tenant.id);

    return {
      id: tenant.id,
      name: tenant.name,
      subdomain: tenant.subdomain,
      subscription_status: tenant.status === 'active' && tenant.plan !== 'trial' ? 'active' :
                          tenant.plan === 'trial' ? 'trial' :
                          tenant.status,
      subscription_plan: tenant.plan || 'trial',
      trial_ends_at: tenant.trial_ends_at || null,
      created_at: tenant.created_at,
      user_count: tenantUsers.length,
      conversation_count: tenantConversations.length,
      lead_count: tenantLeads.length
    };
  });
}