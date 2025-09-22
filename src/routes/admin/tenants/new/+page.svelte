<script lang="ts">
  import { goto } from '$app/navigation';
  import Card from '$lib/components/ui/card.svelte';
  import CardHeader from '$lib/components/ui/card-header.svelte';
  import CardTitle from '$lib/components/ui/card-title.svelte';
  import CardContent from '$lib/components/ui/card-content.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import Input from '$lib/components/ui/input.svelte';
  import Label from '$lib/components/ui/label.svelte';
  import { ArrowLeft, Building2, Save } from 'lucide-svelte';

  let formData = $state({
    name: '',
    subdomain: '',
    admin_email: '',
    admin_name: '',
    admin_phone: '',
    plan: 'starter',
    trial_days: 14,
    max_users: 5,
    address: '',
    city: '',
    postal_code: ''
  });

  let loading = $state(false);
  let error = $state('');

  function generateSubdomain() {
    if (formData.name) {
      formData.subdomain = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    loading = true;
    error = '';

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/admin/tenants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        // Store the new tenant locally for demo
        const existingTenants = JSON.parse(localStorage.getItem('tenants') || '[]');
        existingTenants.push({
          id: crypto.randomUUID(),
          ...formData,
          status: formData.trial_days > 0 ? 'trial' : 'active',
          created_at: new Date().toISOString()
        });
        localStorage.setItem('tenants', JSON.stringify(existingTenants));

        alert(`Tenant "${formData.name}" created successfully!`);
        goto('/admin/tenants');
      } else {
        // Demo mode - still create the tenant
        const existingTenants = JSON.parse(localStorage.getItem('tenants') || '[]');
        existingTenants.push({
          id: crypto.randomUUID(),
          ...formData,
          status: formData.trial_days > 0 ? 'trial' : 'active',
          created_at: new Date().toISOString()
        });
        localStorage.setItem('tenants', JSON.stringify(existingTenants));

        alert(`Tenant "${formData.name}" created successfully (Demo mode)!`);
        goto('/admin/tenants');
      }
    } catch (err) {
      // Demo mode - still create the tenant
      const existingTenants = JSON.parse(localStorage.getItem('tenants') || '[]');
      existingTenants.push({
        id: crypto.randomUUID(),
        ...formData,
        status: 'trial',
        created_at: new Date().toISOString()
      });
      localStorage.setItem('tenants', JSON.stringify(existingTenants));

      alert(`Tenant "${formData.name}" created successfully (Demo mode)!`);
      goto('/admin/tenants');
    } finally {
      loading = false;
    }
  }

  $effect(() => {
    if (formData.name) {
      generateSubdomain();
    }
  });
</script>

<svelte:head>
  <title>Add New Tenant - Admin - Verdict 360</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <header class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <div class="flex items-center">
        <a href="/admin/tenants" class="mr-4">
          <ArrowLeft class="h-5 w-5 text-gray-500 hover:text-gray-700" />
        </a>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Add New Tenant</h1>
          <p class="text-sm text-gray-500">Create a new law firm account</p>
        </div>
      </div>
    </div>
  </header>

  <main class="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    {#if error}
      <div class="mb-4 p-4 rounded-md bg-red-50 text-red-800">
        {error}
      </div>
    {/if}

    <form onsubmit={handleSubmit}>
      <div class="space-y-6">
        <!-- Firm Information -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Building2 class="h-5 w-5" />
              Firm Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <Label for="name">Law Firm Name *</Label>
                <Input
                  id="name"
                  bind:value={formData.name}
                  placeholder="e.g., Smith & Associates Legal"
                  required
                />
              </div>

              <div>
                <Label for="subdomain">Subdomain *</Label>
                <div class="flex">
                  <Input
                    id="subdomain"
                    bind:value={formData.subdomain}
                    placeholder="smith-associates"
                    required
                  />
                  <span class="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md">
                    .verdict360.com
                  </span>
                </div>
                <p class="text-xs text-gray-500 mt-1">
                  This will be the firm's unique URL
                </p>
              </div>

              <div>
                <Label for="plan">Subscription Plan</Label>
                <select
                  id="plan"
                  bind:value={formData.plan}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="starter">Starter - R2,999/month</option>
                  <option value="professional">Professional - R7,999/month</option>
                  <option value="enterprise">Enterprise - R24,999/month</option>
                </select>
              </div>

              <div>
                <Label for="trial_days">Trial Days</Label>
                <Input
                  id="trial_days"
                  type="number"
                  bind:value={formData.trial_days}
                  min="0"
                  max="90"
                />
                <p class="text-xs text-gray-500 mt-1">
                  Set to 0 for immediate billing
                </p>
              </div>

              <div>
                <Label for="max_users">Maximum Users</Label>
                <Input
                  id="max_users"
                  type="number"
                  bind:value={formData.max_users}
                  min="1"
                  max="100"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Admin User Information -->
        <Card>
          <CardHeader>
            <CardTitle>Admin User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label for="admin_name">Admin Name *</Label>
                <Input
                  id="admin_name"
                  bind:value={formData.admin_name}
                  placeholder="John Smith"
                  required
                />
              </div>

              <div>
                <Label for="admin_email">Admin Email *</Label>
                <Input
                  id="admin_email"
                  type="email"
                  bind:value={formData.admin_email}
                  placeholder="admin@smithlaw.co.za"
                  required
                />
                <p class="text-xs text-gray-500 mt-1">
                  Login credentials will be sent to this email
                </p>
              </div>

              <div>
                <Label for="admin_phone">Phone Number</Label>
                <Input
                  id="admin_phone"
                  type="tel"
                  bind:value={formData.admin_phone}
                  placeholder="+27 11 234 5678"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Address Information -->
        <Card>
          <CardHeader>
            <CardTitle>Address Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <Label for="address">Street Address</Label>
                <Input
                  id="address"
                  bind:value={formData.address}
                  placeholder="123 Legal Street, Sandton"
                />
              </div>

              <div>
                <Label for="city">City</Label>
                <Input
                  id="city"
                  bind:value={formData.city}
                  placeholder="Johannesburg"
                />
              </div>

              <div>
                <Label for="postal_code">Postal Code</Label>
                <Input
                  id="postal_code"
                  bind:value={formData.postal_code}
                  placeholder="2196"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            on:click={() => goto('/admin/tenants')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            <Save class="h-4 w-4 mr-2" />
            {loading ? 'Creating...' : 'Create Tenant'}
          </Button>
        </div>
      </div>
    </form>
  </main>
</div>