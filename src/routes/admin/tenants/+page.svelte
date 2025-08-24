<script lang="ts">
  import { onMount } from 'svelte';
  import Card from '$lib/components/ui/card.svelte';
  import CardHeader from '$lib/components/ui/card-header.svelte';
  import CardTitle from '$lib/components/ui/card-title.svelte';
  import CardContent from '$lib/components/ui/card-content.svelte';
  import Badge from '$lib/components/ui/badge.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import Input from '$lib/components/ui/input.svelte';
  
  let tenants = $state([]);
  let loading = $state(true);
  let searchTerm = $state('');
  let statusFilter = $state('all');
  let planFilter = $state('all');
  let currentPage = $state(1);
  let totalPages = $state(1);
  
  onMount(async () => {
    await fetchTenants();
  });
  
  async function fetchTenants() {
    loading = true;
    try {
      const token = localStorage.getItem('accessToken');
      const params = new URLSearchParams({
        page: currentPage.toString(),
        search: searchTerm,
        status: statusFilter,
        plan: planFilter
      });
      
      const response = await fetch(`/api/admin/tenants?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        tenants = data.tenants || [];
        totalPages = data.totalPages || 1;
      }
    } catch (error) {
      console.error('Error fetching tenants:', error);
    } finally {
      loading = false;
    }
  }
  
  async function toggleTenantStatus(tenantId: string, currentStatus: string) {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const token = localStorage.getItem('accessToken');
    
    try {
      const response = await fetch(`/api/admin/tenants/${tenantId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        await fetchTenants();
      }
    } catch (error) {
      console.error('Error updating tenant status:', error);
    }
  }
  
  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  }
</script>

<svelte:head>
  <title>Manage Tenants - Verdict 360 Admin</title>
  <meta name="description" content="Manage all tenant accounts on the Verdict 360 platform." />
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <header class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Tenant Management</h1>
          <p class="text-sm text-gray-600">Manage all law firms on the platform</p>
        </div>
        <div class="flex items-center space-x-4">
          <Button variant="outline" onclick={() => window.location.href = '/admin'}>
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Button>
          <Button variant="default" onclick={() => window.location.href = '/admin/tenants/new'}>
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Tenant
          </Button>
        </div>
      </div>
    </div>
  </header>
  
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Filters -->
    <Card class="mb-6">
      <CardContent class="py-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <Input
              type="text"
              id="search"
              placeholder="Search by name or email..."
              bind:value={searchTerm}
              onchange={fetchTenants}
              class="w-full"
            />
          </div>
          
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              bind:value={statusFilter}
              onchange={fetchTenants}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="trial">Trial</option>
            </select>
          </div>
          
          <div>
            <label for="plan" class="block text-sm font-medium text-gray-700 mb-1">
              Plan
            </label>
            <select
              id="plan"
              bind:value={planFilter}
              onchange={fetchTenants}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Plans</option>
              <option value="starter">Starter</option>
              <option value="professional">Professional</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
          
          <div class="flex items-end">
            <Button variant="outline" onclick={fetchTenants} class="w-full">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <!-- Tenants Table -->
    <Card>
      <CardHeader>
        <CardTitle>All Tenants</CardTitle>
      </CardHeader>
      <CardContent>
        {#if loading}
          <div class="flex justify-center items-center py-12">
            <svg class="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        {:else}
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-3 px-4 text-sm font-medium text-gray-700">Firm Name</th>
                  <th class="text-left py-3 px-4 text-sm font-medium text-gray-700">Contact</th>
                  <th class="text-left py-3 px-4 text-sm font-medium text-gray-700">Plan</th>
                  <th class="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                  <th class="text-left py-3 px-4 text-sm font-medium text-gray-700">Users</th>
                  <th class="text-left py-3 px-4 text-sm font-medium text-gray-700">MRR</th>
                  <th class="text-left py-3 px-4 text-sm font-medium text-gray-700">Created</th>
                  <th class="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {#if tenants.length === 0}
                  <tr>
                    <td colspan="8" class="text-center py-12 text-gray-500">
                      No tenants found
                    </td>
                  </tr>
                {/if}
                
                <!-- Demo Data -->
                <tr class="border-b hover:bg-gray-50">
                  <td class="py-3 px-4">
                    <div>
                      <div class="font-medium">Smith & Associates</div>
                      <div class="text-sm text-gray-500">smith.verdict360.com</div>
                    </div>
                  </td>
                  <td class="py-3 px-4">
                    <div class="text-sm">
                      <div>john@smithlaw.co.za</div>
                      <div class="text-gray-500">+27 11 234 5678</div>
                    </div>
                  </td>
                  <td class="py-3 px-4">
                    <Badge variant="default">Professional</Badge>
                  </td>
                  <td class="py-3 px-4">
                    <Badge variant="success">Active</Badge>
                  </td>
                  <td class="py-3 px-4">8</td>
                  <td class="py-3 px-4 font-medium">R7,999</td>
                  <td class="py-3 px-4 text-sm text-gray-600">Dec 01, 2024</td>
                  <td class="py-3 px-4">
                    <div class="flex space-x-2">
                      <Button size="sm" variant="outline" onclick={() => window.location.href = '/admin/tenants/smith'}>
                        View
                      </Button>
                      <Button size="sm" variant="outline" onclick={() => toggleTenantStatus('smith', 'active')}>
                        Suspend
                      </Button>
                    </div>
                  </td>
                </tr>
                
                <tr class="border-b hover:bg-gray-50">
                  <td class="py-3 px-4">
                    <div>
                      <div class="font-medium">Cape Town Legal</div>
                      <div class="text-sm text-gray-500">capetown.verdict360.com</div>
                    </div>
                  </td>
                  <td class="py-3 px-4">
                    <div class="text-sm">
                      <div>info@ctlegal.co.za</div>
                      <div class="text-gray-500">+27 21 456 7890</div>
                    </div>
                  </td>
                  <td class="py-3 px-4">
                    <Badge variant="default">Starter</Badge>
                  </td>
                  <td class="py-3 px-4">
                    <Badge variant="warning">Trial</Badge>
                  </td>
                  <td class="py-3 px-4">3</td>
                  <td class="py-3 px-4 font-medium">R0</td>
                  <td class="py-3 px-4 text-sm text-gray-600">Dec 10, 2024</td>
                  <td class="py-3 px-4">
                    <div class="flex space-x-2">
                      <Button size="sm" variant="outline" onclick={() => window.location.href = '/admin/tenants/capetown'}>
                        View
                      </Button>
                      <Button size="sm" variant="default">
                        Convert
                      </Button>
                    </div>
                  </td>
                </tr>
                
                <tr class="border-b hover:bg-gray-50">
                  <td class="py-3 px-4">
                    <div>
                      <div class="font-medium">Johannesburg Associates</div>
                      <div class="text-sm text-gray-500">jhb.verdict360.com</div>
                    </div>
                  </td>
                  <td class="py-3 px-4">
                    <div class="text-sm">
                      <div>admin@jhblaw.co.za</div>
                      <div class="text-gray-500">+27 11 987 6543</div>
                    </div>
                  </td>
                  <td class="py-3 px-4">
                    <Badge variant="default">Enterprise</Badge>
                  </td>
                  <td class="py-3 px-4">
                    <Badge variant="success">Active</Badge>
                  </td>
                  <td class="py-3 px-4">25</td>
                  <td class="py-3 px-4 font-medium">R24,999</td>
                  <td class="py-3 px-4 text-sm text-gray-600">Nov 15, 2024</td>
                  <td class="py-3 px-4">
                    <div class="flex space-x-2">
                      <Button size="sm" variant="outline" onclick={() => window.location.href = '/admin/tenants/jhb'}>
                        View
                      </Button>
                      <Button size="sm" variant="outline" onclick={() => toggleTenantStatus('jhb', 'active')}>
                        Suspend
                      </Button>
                    </div>
                  </td>
                </tr>
                
                {#each tenants as tenant}
                  <tr class="border-b hover:bg-gray-50">
                    <td class="py-3 px-4">
                      <div>
                        <div class="font-medium">{tenant.name}</div>
                        <div class="text-sm text-gray-500">{tenant.subdomain}.verdict360.com</div>
                      </div>
                    </td>
                    <td class="py-3 px-4">
                      <div class="text-sm">
                        <div>{tenant.email}</div>
                        <div class="text-gray-500">{tenant.phone}</div>
                      </div>
                    </td>
                    <td class="py-3 px-4">
                      <Badge variant="default">{tenant.plan}</Badge>
                    </td>
                    <td class="py-3 px-4">
                      <Badge variant={tenant.status === 'active' ? 'success' : tenant.status === 'trial' ? 'warning' : 'secondary'}>
                        {tenant.status}
                      </Badge>
                    </td>
                    <td class="py-3 px-4">{tenant.userCount}</td>
                    <td class="py-3 px-4 font-medium">{formatCurrency(tenant.mrr)}</td>
                    <td class="py-3 px-4 text-sm text-gray-600">{formatDate(tenant.createdAt)}</td>
                    <td class="py-3 px-4">
                      <div class="flex space-x-2">
                        <Button size="sm" variant="outline" onclick={() => window.location.href = `/admin/tenants/${tenant.id}`}>
                          View
                        </Button>
                        <Button size="sm" variant="outline" onclick={() => toggleTenantStatus(tenant.id, tenant.status)}>
                          {tenant.status === 'active' ? 'Suspend' : 'Activate'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
          <div class="flex justify-between items-center mt-6">
            <div class="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div class="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onclick={() => { currentPage--; fetchTenants(); }}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onclick={() => { currentPage++; fetchTenants(); }}
              >
                Next
              </Button>
            </div>
          </div>
        {/if}
      </CardContent>
    </Card>
  </main>
</div>