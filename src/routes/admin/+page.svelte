<script lang="ts">
  import { onMount } from 'svelte';
  import Card from '$lib/components/ui/card.svelte';
  import CardHeader from '$lib/components/ui/card-header.svelte';
  import CardTitle from '$lib/components/ui/card-title.svelte';
  import CardContent from '$lib/components/ui/card-content.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import Input from '$lib/components/ui/input.svelte';
  import Badge from '$lib/components/ui/badge.svelte';
  import { 
    Users, 
    Building2, 
    CreditCard, 
    TrendingUp, 
    MessageSquare,
    Calendar,
    Mail,
    AlertCircle,
    Search,
    Filter,
    Download,
    RefreshCw
  } from 'lucide-svelte';
  
  interface PlatformStats {
    total_tenants: number;
    active_subscriptions: number;
    trial_subscriptions: number;
    monthly_conversations: number;
    monthly_leads: number;
    monthly_appointments: number;
    monthly_revenue: number;
  }
  
  interface Tenant {
    id: string;
    name: string;
    subdomain: string;
    subscription_status: string;
    subscription_plan: string;
    trial_ends_at: string | null;
    created_at: string;
    user_count: number;
    conversation_count: number;
    lead_count: number;
  }
  
  interface SystemHealth {
    status: 'healthy' | 'unhealthy';
    database: string;
    last_24_hours: {
      conversations: number;
      leads: number;
      appointments: number;
      emails_sent: number;
      email_failures: number;
    };
  }
  
  let platformStats: PlatformStats = {
    total_tenants: 0,
    active_subscriptions: 0,
    trial_subscriptions: 0,
    monthly_conversations: 0,
    monthly_leads: 0,
    monthly_appointments: 0,
    monthly_revenue: 0
  };
  
  let tenants: Tenant[] = [];
  let systemHealth: SystemHealth | null = null;
  let loading = true;
  let searchTerm = '';
  let statusFilter = 'all';
  let planFilter = 'all';
  let currentPage = 1;
  
  onMount(async () => {
    await fetchDashboardData();
    await fetchSystemHealth();
  });
  
  async function fetchDashboardData() {
    try {
      const token = localStorage.getItem('accessToken');
      const [dashboardRes, tenantsRes] = await Promise.all([
        fetch('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`/api/admin/tenants?page=${currentPage}&status=${statusFilter}&plan=${planFilter}&search=${searchTerm}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      if (dashboardRes.ok) {
        const dashboardData = await dashboardRes.json();
        platformStats = dashboardData;
      }
      
      if (tenantsRes.ok) {
        const tenantsData = await tenantsRes.json();
        tenants = tenantsData.tenants || [];
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      loading = false;
    }
  }
  
  async function fetchSystemHealth() {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/admin/system/health', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        systemHealth = data.system_health;
      }
    } catch (error) {
      console.error('Error fetching system health:', error);
    }
  }
  
  async function handleTenantAction(tenantId: string, action: 'suspend' | 'activate') {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/admin/tenants/${tenantId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });
      
      if (response.ok) {
        await fetchDashboardData();
      }
    } catch (error) {
      console.error(`Error ${action}ing tenant:`, error);
    }
  }
  
  function getStatusVariant(status: string): 'success' | 'warning' | 'destructive' | 'secondary' | 'default' {
    switch (status) {
      case 'active': return 'success';
      case 'trial': return 'default';
      case 'trialing': return 'default';
      case 'past_due': return 'warning';
      case 'canceled': return 'destructive';
      case 'suspended': return 'secondary';
      case 'inactive': return 'secondary';
      default: return 'secondary';
    }
  }

  function formatCurrency(amount: number): string {
    // Handle invalid amounts
    if (isNaN(amount) || amount === null || amount === undefined) {
      amount = 0;
    }
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  }
  
  function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
</script>

<svelte:head>
  <title>Admin Dashboard - Verdict 360</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <header class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div class="flex gap-2">
          <a href="/admin/tenants" class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary-500 text-white hover:bg-primary-600 shadow-sm h-10 px-4 py-2">
            <Building2 class="w-4 h-4 mr-2" />
            Manage Tenants
          </a>
          <a href="/admin/settings" class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-transparent hover:bg-gray-50 shadow-sm h-10 px-4 py-2">
            Settings
          </a>
        </div>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    {#if loading}
      <div class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    {:else}
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Total Tenants</CardTitle>
            <Building2 class="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{platformStats.total_tenants}</div>
            <p class="text-xs text-gray-500">Active law firms on platform</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard class="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{platformStats.active_subscriptions}</div>
            <p class="text-xs text-gray-500">
              +{platformStats.trial_subscriptions} in trial
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Monthly Conversations</CardTitle>
            <MessageSquare class="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{platformStats.monthly_conversations}</div>
            <p class="text-xs text-gray-500">Across all tenants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp class="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{formatCurrency(platformStats.monthly_revenue)}</div>
            <p class="text-xs text-gray-500">Recurring revenue</p>
          </CardContent>
        </Card>
      </div>

      <!-- System Health -->
      {#if systemHealth}
        <Card class="mb-6">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <AlertCircle class="h-5 w-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex items-center gap-4 mb-4">
              <Badge variant={systemHealth.status === 'healthy' ? 'success' : 'destructive'}>
                {systemHealth.status.toUpperCase()}
              </Badge>
              <span class="text-sm text-gray-500">Database: {systemHealth.database}</span>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div>
                <p class="text-gray-500">Conversations (24h)</p>
                <p class="font-semibold">{systemHealth.last_24_hours.conversations}</p>
              </div>
              <div>
                <p class="text-gray-500">Leads (24h)</p>
                <p class="font-semibold">{systemHealth.last_24_hours.leads}</p>
              </div>
              <div>
                <p class="text-gray-500">Appointments (24h)</p>
                <p class="font-semibold">{systemHealth.last_24_hours.appointments}</p>
              </div>
              <div>
                <p class="text-gray-500">Emails Sent (24h)</p>
                <p class="font-semibold">{systemHealth.last_24_hours.emails_sent}</p>
              </div>
              <div>
                <p class="text-gray-500">Email Failures (24h)</p>
                <p class="font-semibold text-red-600">{systemHealth.last_24_hours.email_failures}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      {/if}

      <!-- Tenants Table -->
      <Card>
        <CardHeader>
          <div class="flex justify-between items-center">
            <CardTitle>Recent Tenants</CardTitle>
            <div class="flex gap-2">
              <div class="relative">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search tenants..."
                  class="pl-10 w-64"
                  bind:value={searchTerm}
                  on:input={() => fetchDashboardData()}
                />
              </div>
              <Button variant="outline" on:click={fetchDashboardData}>
                <RefreshCw class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-700">Subdomain</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-700">Plan</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-700">Users</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-700">Conversations</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-700">Created</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {#each tenants as tenant}
                  <tr class="border-b hover:bg-gray-50">
                    <td class="py-3 px-4 font-medium">{tenant.name}</td>
                    <td class="py-3 px-4">
                      <code class="text-sm bg-gray-100 px-2 py-1 rounded">{tenant.subdomain}</code>
                    </td>
                    <td class="py-3 px-4">
                      <Badge variant={getStatusVariant(tenant.subscription_status)}>
                        {tenant.subscription_status}
                      </Badge>
                    </td>
                    <td class="py-3 px-4">
                      <Badge variant="outline">{tenant.subscription_plan}</Badge>
                    </td>
                    <td class="py-3 px-4">{tenant.user_count}</td>
                    <td class="py-3 px-4">{tenant.conversation_count}</td>
                    <td class="py-3 px-4 text-sm text-gray-500">
                      {formatDate(tenant.created_at)}
                    </td>
                    <td class="py-3 px-4">
                      <div class="flex gap-2">
                        <a href="/admin/tenants/{tenant.id}" class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-transparent hover:bg-gray-50 shadow-sm h-9 rounded-md px-3">
                          View
                        </a>
                        {#if tenant.subscription_status === 'suspended'}
                          <Button 
                            size="sm" 
                            variant="default"
                            on:click={() => handleTenantAction(tenant.id, 'activate')}
                          >
                            Activate
                          </Button>
                        {:else if tenant.subscription_status !== 'canceled'}
                          <Button 
                            size="sm" 
                            variant="destructive"
                            on:click={() => handleTenantAction(tenant.id, 'suspend')}
                          >
                            Suspend
                          </Button>
                        {/if}
                      </div>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    {/if}
  </main>
</div>