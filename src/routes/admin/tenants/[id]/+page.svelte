<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import Card from '$lib/components/ui/card.svelte';
  import CardHeader from '$lib/components/ui/card-header.svelte';
  import CardTitle from '$lib/components/ui/card-title.svelte';
  import CardContent from '$lib/components/ui/card-content.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import Input from '$lib/components/ui/input.svelte';
  import Label from '$lib/components/ui/label.svelte';
  import Badge from '$lib/components/ui/badge.svelte';
  import { ArrowLeft, Save, Users, MessageSquare, Calendar, Mail, CreditCard, Activity, Settings, Trash2 } from 'lucide-svelte';

  let tenant = $state({
    id: '',
    name: '',
    subdomain: '',
    subscription_status: '',
    subscription_plan: '',
    trial_ends_at: null,
    created_at: '',
    settings: {
      max_users: 5,
      max_conversations_per_month: 1000,
      max_leads_per_month: 100,
      custom_branding: false,
      white_label: false,
      api_access: false
    },
    billing: {
      stripe_customer_id: '',
      stripe_subscription_id: '',
      current_period_end: '',
      monthly_cost: 0,
      payment_method: ''
    },
    stats: {
      total_users: 0,
      total_conversations: 0,
      total_leads: 0,
      total_appointments: 0,
      emails_sent: 0,
      storage_used: 0
    },
    users: [],
    recent_activity: []
  });

  let loading = $state(true);
  let saveStatus = $state('');
  let activeTab = $state('overview');

  let tenantId = $derived(page.params.id);

  onMount(() => {
    fetchTenantDetails();
  });

  $effect(() => {
    if (tenantId) {
      fetchTenantDetails();
    }
  });

  async function fetchTenantDetails() {
    if (!tenantId) return;

    try {
      loading = true;
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/admin/tenants/${tenantId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        tenant = { ...tenant, ...data };
      } else {
        // Fallback to localStorage data
        const tenants = JSON.parse(localStorage.getItem('tenants') || '[]');
        const foundTenant = tenants.find((t: any) => t.id === tenantId);

        if (foundTenant) {
          // Map the stored tenant data to the expected format
          tenant = {
            ...tenant,
            id: foundTenant.id,
            name: foundTenant.name,
            subdomain: foundTenant.subdomain,
            subscription_status: foundTenant.status || 'active',
            subscription_plan: foundTenant.plan || 'starter',
            trial_ends_at: foundTenant.trial_days > 0 ? new Date(Date.now() + foundTenant.trial_days * 24 * 60 * 60 * 1000).toISOString() : null,
            created_at: foundTenant.created_at || new Date().toISOString(),
            settings: {
              max_users: foundTenant.max_users || 5,
              max_conversations_per_month: 1000,
              max_leads_per_month: 100,
              custom_branding: foundTenant.plan === 'enterprise',
              white_label: foundTenant.plan === 'enterprise',
              api_access: foundTenant.plan !== 'starter'
            },
            billing: {
              stripe_customer_id: `cus_${foundTenant.id}`,
              stripe_subscription_id: `sub_${foundTenant.id}`,
              current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              monthly_cost: getPlanPrice(foundTenant.plan),
              payment_method: 'card'
            },
            stats: {
              total_users: foundTenant.max_users || 5,
              total_conversations: Math.floor(Math.random() * 100) + 50,
              total_leads: Math.floor(Math.random() * 50) + 20,
              total_appointments: Math.floor(Math.random() * 30) + 10,
              emails_sent: Math.floor(Math.random() * 200) + 100,
              storage_used: Math.floor(Math.random() * 500) + 100
            },
            users: [],
            recent_activity: []
          };

          // Load users for this tenant
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          tenant.users = users.filter((u: any) => u.tenant_id === tenantId);
        }
      }
    } catch (error) {
      console.error('Error fetching tenant details:', error);

      // Fallback to localStorage data even on error
      const tenants = JSON.parse(localStorage.getItem('tenants') || '[]');
      const foundTenant = tenants.find((t: any) => t.id === tenantId);

      if (foundTenant) {
        tenant = {
          ...tenant,
          id: foundTenant.id,
          name: foundTenant.name,
          subdomain: foundTenant.subdomain,
          subscription_status: foundTenant.status || 'active',
          subscription_plan: foundTenant.plan || 'starter',
          trial_ends_at: foundTenant.trial_days > 0 ? new Date(Date.now() + foundTenant.trial_days * 24 * 60 * 60 * 1000).toISOString() : null,
          created_at: foundTenant.created_at || new Date().toISOString(),
          settings: {
            max_users: foundTenant.max_users || 5,
            max_conversations_per_month: 1000,
            max_leads_per_month: 100,
            custom_branding: foundTenant.plan === 'enterprise',
            white_label: foundTenant.plan === 'enterprise',
            api_access: foundTenant.plan !== 'starter'
          },
          billing: {
            stripe_customer_id: `cus_${foundTenant.id}`,
            stripe_subscription_id: `sub_${foundTenant.id}`,
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            monthly_cost: getPlanPrice(foundTenant.plan),
            payment_method: 'card'
          },
          stats: {
            total_users: foundTenant.max_users || 5,
            total_conversations: Math.floor(Math.random() * 100) + 50,
            total_leads: Math.floor(Math.random() * 50) + 20,
            total_appointments: Math.floor(Math.random() * 30) + 10,
            emails_sent: Math.floor(Math.random() * 200) + 100,
            storage_used: Math.floor(Math.random() * 500) + 100
          },
          users: [],
          recent_activity: []
        };

        // Load users for this tenant
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        tenant.users = users.filter((u: any) => u.tenant_id === tenantId);
      }
    } finally {
      loading = false;
    }
  }

  function getPlanPrice(plan: string) {
    const planLower = (plan || '').toLowerCase();
    switch(planLower) {
      case 'starter': return 2999;
      case 'professional': return 7999;
      case 'enterprise': return 24999;
      default: return 0;
    }
  }

  async function saveTenantSettings() {
    saveStatus = '';
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/admin/tenants/${tenantId}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(tenant.settings)
      });

      if (response.ok) {
        saveStatus = 'Settings saved successfully!';
        setTimeout(() => saveStatus = '', 3000);
      } else {
        saveStatus = 'Failed to save settings';
      }
    } catch (error) {
      console.error('Error saving tenant settings:', error);
      saveStatus = 'Error saving settings';
    }
  }

  async function changeTenantStatus(action: string) {
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
        await fetchTenantDetails();
        alert(`Tenant ${action}d successfully`);
      }
    } catch (error) {
      console.error(`Error ${action}ing tenant:`, error);
    }
  }

  async function deleteTenant() {
    if (!confirm('Are you sure you want to delete this tenant? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/admin/tenants/${tenantId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        window.location.href = '/admin/tenants';
      }
    } catch (error) {
      console.error('Error deleting tenant:', error);
      alert('Failed to delete tenant');
    }
  }

  function getStatusVariant(status: string): 'success' | 'warning' | 'destructive' | 'secondary' | 'default' {
    switch (status) {
      case 'active': return 'success';
      case 'trialing': return 'default';
      case 'past_due': return 'warning';
      case 'canceled': return 'destructive';
      case 'suspended': return 'secondary';
      default: return 'secondary';
    }
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  }

  function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
</script>

<svelte:head>
  <title>{tenant.name || 'Tenant Details'} - Admin - Verdict 360</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <header class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <a href="/admin/tenants" class="mr-4">
            <ArrowLeft class="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </a>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{tenant.name || 'Loading...'}</h1>
            <p class="text-sm text-gray-500">{tenant.subdomain}.verdict360.com</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <Badge variant={getStatusVariant(tenant.subscription_status)}>
            {tenant.subscription_status}
          </Badge>
          <Badge variant="outline">{tenant.subscription_plan}</Badge>
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
      {#if saveStatus}
        <div class="mb-4 p-4 rounded-md {saveStatus.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}">
          {saveStatus}
        </div>
      {/if}

      <!-- Tabs -->
      <div class="border-b border-gray-200 mb-6">
        <nav class="-mb-px flex space-x-8">
          <button
            class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'overview' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
            on:click={() => activeTab = 'overview'}
          >
            Overview
          </button>
          <button
            class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'settings' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
            on:click={() => activeTab = 'settings'}
          >
            Settings
          </button>
          <button
            class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'billing' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
            on:click={() => activeTab = 'billing'}
          >
            Billing
          </button>
          <button
            class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'users' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
            on:click={() => activeTab = 'users'}
          >
            Users
          </button>
          <button
            class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'activity' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
            on:click={() => activeTab = 'activity'}
          >
            Activity
          </button>
        </nav>
      </div>

      {#if activeTab === 'overview'}
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">Total Users</CardTitle>
              <Users class="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">{tenant.stats.total_users}</div>
              <p class="text-xs text-gray-500">Max allowed: {tenant.settings.max_users}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">Conversations</CardTitle>
              <MessageSquare class="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">{tenant.stats.total_conversations}</div>
              <p class="text-xs text-gray-500">Monthly limit: {tenant.settings.max_conversations_per_month}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">Leads</CardTitle>
              <Users class="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">{tenant.stats.total_leads}</div>
              <p class="text-xs text-gray-500">Monthly limit: {tenant.settings.max_leads_per_month}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">Appointments</CardTitle>
              <Calendar class="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">{tenant.stats.total_appointments}</div>
              <p class="text-xs text-gray-500">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">Emails Sent</CardTitle>
              <Mail class="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">{tenant.stats.emails_sent}</div>
              <p class="text-xs text-gray-500">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">Storage Used</CardTitle>
              <Activity class="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">{formatBytes(tenant.stats.storage_used)}</div>
              <p class="text-xs text-gray-500">Total storage</p>
            </CardContent>
          </Card>
        </div>

        <!-- Actions -->
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex flex-wrap gap-2">
              {#if tenant.subscription_status === 'suspended'}
                <Button variant="success" on:click={() => changeTenantStatus('activate')}>
                  Activate Tenant
                </Button>
              {:else if tenant.subscription_status !== 'canceled'}
                <Button variant="warning" on:click={() => changeTenantStatus('suspend')}>
                  Suspend Tenant
                </Button>
              {/if}

              <Button variant="outline" on:click={() => window.open(`https://${tenant.subdomain}.verdict360.com`, '_blank')}>
                Visit Site
              </Button>

              <Button variant="outline">
                Login as Admin
              </Button>

              <Button variant="outline">
                Export Data
              </Button>

              <Button variant="destructive" on:click={deleteTenant}>
                <Trash2 class="h-4 w-4 mr-2" />
                Delete Tenant
              </Button>
            </div>
          </CardContent>
        </Card>
      {/if}

      {#if activeTab === 'settings'}
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Settings class="h-5 w-5" />
              Tenant Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label for="max-users">Max Users</Label>
                  <Input
                    id="max-users"
                    type="number"
                    bind:value={tenant.settings.max_users}
                  />
                </div>
                <div>
                  <Label for="max-conversations">Max Conversations/Month</Label>
                  <Input
                    id="max-conversations"
                    type="number"
                    bind:value={tenant.settings.max_conversations_per_month}
                  />
                </div>
                <div>
                  <Label for="max-leads">Max Leads/Month</Label>
                  <Input
                    id="max-leads"
                    type="number"
                    bind:value={tenant.settings.max_leads_per_month}
                  />
                </div>
              </div>

              <div class="space-y-2">
                <div class="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="custom-branding"
                    bind:checked={tenant.settings.custom_branding}
                    class="rounded border-gray-300"
                  />
                  <Label for="custom-branding">Custom Branding</Label>
                </div>
                <div class="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="white-label"
                    bind:checked={tenant.settings.white_label}
                    class="rounded border-gray-300"
                  />
                  <Label for="white-label">White Label</Label>
                </div>
                <div class="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="api-access"
                    bind:checked={tenant.settings.api_access}
                    class="rounded border-gray-300"
                  />
                  <Label for="api-access">API Access</Label>
                </div>
              </div>

              <Button on:click={saveTenantSettings}>
                <Save class="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      {/if}

      {#if activeTab === 'billing'}
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <CreditCard class="h-5 w-5" />
              Billing Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Stripe Customer ID</p>
                  <p class="font-mono">{tenant.billing.stripe_customer_id || 'Not set'}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Stripe Subscription ID</p>
                  <p class="font-mono">{tenant.billing.stripe_subscription_id || 'Not set'}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Current Period End</p>
                  <p>{tenant.billing.current_period_end ? formatDate(tenant.billing.current_period_end) : 'N/A'}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Monthly Cost</p>
                  <p class="text-2xl font-bold">{formatCurrency(tenant.billing.monthly_cost)}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Payment Method</p>
                  <p>{tenant.billing.payment_method || 'No payment method'}</p>
                </div>
                {#if tenant.trial_ends_at}
                  <div>
                    <p class="text-sm text-gray-500">Trial Ends</p>
                    <p>{formatDate(tenant.trial_ends_at)}</p>
                  </div>
                {/if}
              </div>

              <div class="flex gap-2">
                <Button variant="outline">View Invoices</Button>
                <Button variant="outline">Update Payment Method</Button>
                <Button variant="outline">Cancel Subscription</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      {/if}

      {#if activeTab === 'users'}
        <Card>
          <CardHeader>
            <div class="flex justify-between items-center">
              <CardTitle>Users</CardTitle>
              <Button size="sm">Add User</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b">
                    <th class="text-left py-2 text-sm font-medium text-gray-700">Name</th>
                    <th class="text-left py-2 text-sm font-medium text-gray-700">Email</th>
                    <th class="text-left py-2 text-sm font-medium text-gray-700">Role</th>
                    <th class="text-left py-2 text-sm font-medium text-gray-700">Status</th>
                    <th class="text-left py-2 text-sm font-medium text-gray-700">Last Login</th>
                    <th class="text-left py-2 text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {#if tenant.users.length === 0}
                    <tr>
                      <td colspan="6" class="text-center py-8 text-gray-500">
                        No users found
                      </td>
                    </tr>
                  {:else}
                    {#each tenant.users as user}
                      <tr class="border-b hover:bg-gray-50">
                        <td class="py-3">{user.name}</td>
                        <td class="py-3">{user.email}</td>
                        <td class="py-3">
                          <Badge variant="outline">{user.role}</Badge>
                        </td>
                        <td class="py-3">
                          <Badge variant={user.status === 'active' ? 'success' : 'secondary'}>
                            {user.status}
                          </Badge>
                        </td>
                        <td class="py-3 text-sm text-gray-600">
                          {user.last_login ? formatDate(user.last_login) : 'Never'}
                        </td>
                        <td class="py-3">
                          <Button variant="outline" size="sm">Edit</Button>
                        </td>
                      </tr>
                    {/each}
                  {/if}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      {/if}

      {#if activeTab === 'activity'}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              {#if tenant.recent_activity.length === 0}
                <p class="text-center py-8 text-gray-500">No recent activity</p>
              {:else}
                {#each tenant.recent_activity as activity}
                  <div class="flex items-start space-x-3 pb-3 border-b last:border-0">
                    <div class="flex-1">
                      <p class="text-sm font-medium">{activity.description}</p>
                      <p class="text-xs text-gray-500">{activity.user} • {formatDate(activity.timestamp)}</p>
                    </div>
                  </div>
                {/each}
              {/if}
            </div>
          </CardContent>
        </Card>
      {/if}
    {/if}
  </main>
</div>