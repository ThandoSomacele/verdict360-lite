<script lang="ts">
  import { onMount } from 'svelte';
  import Card from '$lib/components/ui/card.svelte';
  import CardHeader from '$lib/components/ui/card-header.svelte';
  import CardTitle from '$lib/components/ui/card-title.svelte';
  import CardContent from '$lib/components/ui/card-content.svelte';
  import Badge from '$lib/components/ui/badge.svelte';
  import Button from '$lib/components/ui/button.svelte';
  
  let user = $state({ name: '', email: '', firmName: '', role: '' });
  let stats = $state({
    totalConversations: 0,
    monthlyConversations: 0,
    totalLeads: 0,
    appointmentsScheduled: 0,
    averageResponseTime: '0s',
    satisfactionRate: 0
  });
  let recentConversations = $state([]);
  let loading = $state(true);
  
  onMount(async () => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      user = JSON.parse(storedUser);
    }
    
    // Fetch dashboard data
    await fetchDashboardData();
  });
  
  async function fetchDashboardData() {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        stats = data.stats || stats;
        recentConversations = data.recentConversations || [];
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      loading = false;
    }
  }
  
  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<svelte:head>
  <title>Dashboard - Verdict 360</title>
  <meta name="description" content="Manage your Verdict 360 AI legal assistant and view analytics." />
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <header class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p class="text-sm text-gray-600">Welcome back, {user.name || 'User'}</p>
        </div>
        <div class="flex items-center space-x-4">
          <Badge variant="success">{user.firmName || 'Demo Firm'}</Badge>
          <Button variant="outline" onclick={() => window.location.href = '/settings'}>
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </Button>
        </div>
      </div>
    </div>
  </header>
  
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {#if loading}
      <div class="flex justify-center items-center h-64">
        <svg class="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    {:else}
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Total Conversations</CardTitle>
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{stats.totalConversations || 245}</div>
            <p class="text-xs text-gray-500">All time conversations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Monthly Conversations</CardTitle>
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{stats.monthlyConversations || 87}</div>
            <p class="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">New Leads</CardTitle>
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{stats.totalLeads || 34}</div>
            <p class="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Appointments</CardTitle>
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{stats.appointmentsScheduled || 12}</div>
            <p class="text-xs text-gray-500">Scheduled this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Avg Response Time</CardTitle>
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{stats.averageResponseTime || '1.2s'}</div>
            <p class="text-xs text-gray-500">Average AI response</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Satisfaction Rate</CardTitle>
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{stats.satisfactionRate || 94}%</div>
            <p class="text-xs text-gray-500">Client satisfaction</p>
          </CardContent>
        </Card>
      </div>
      
      <!-- Recent Conversations -->
      <Card>
        <CardHeader>
          <div class="flex justify-between items-center">
            <CardTitle>Recent Conversations</CardTitle>
            <Button variant="outline" size="sm" onclick={() => window.location.href = '/dashboard/conversations'}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-2 text-sm font-medium text-gray-700">Client</th>
                  <th class="text-left py-2 text-sm font-medium text-gray-700">Topic</th>
                  <th class="text-left py-2 text-sm font-medium text-gray-700">Date</th>
                  <th class="text-left py-2 text-sm font-medium text-gray-700">Status</th>
                  <th class="text-left py-2 text-sm font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {#if recentConversations.length === 0}
                  <tr>
                    <td colspan="5" class="text-center py-8 text-gray-500">
                      No recent conversations
                    </td>
                  </tr>
                {:else}
                  {#each recentConversations as conversation}
                    <tr class="border-b hover:bg-gray-50">
                      <td class="py-3">{conversation.clientName}</td>
                      <td class="py-3">{conversation.topic}</td>
                      <td class="py-3 text-sm text-gray-600">{formatDate(conversation.date)}</td>
                      <td class="py-3">
                        <Badge variant={conversation.status === 'completed' ? 'success' : 'default'}>
                          {conversation.status}
                        </Badge>
                      </td>
                      <td class="py-3">
                        <Button variant="outline" size="sm">View</Button>
                      </td>
                    </tr>
                  {/each}
                {/if}
                
                <!-- Demo Data -->
                <tr class="border-b hover:bg-gray-50">
                  <td class="py-3">John Doe</td>
                  <td class="py-3">Divorce Consultation</td>
                  <td class="py-3 text-sm text-gray-600">Dec 20, 2024, 14:30</td>
                  <td class="py-3">
                    <Badge variant="success">completed</Badge>
                  </td>
                  <td class="py-3">
                    <Button variant="outline" size="sm">View</Button>
                  </td>
                </tr>
                <tr class="border-b hover:bg-gray-50">
                  <td class="py-3">Jane Smith</td>
                  <td class="py-3">Property Transfer</td>
                  <td class="py-3 text-sm text-gray-600">Dec 20, 2024, 11:15</td>
                  <td class="py-3">
                    <Badge variant="warning">follow-up</Badge>
                  </td>
                  <td class="py-3">
                    <Button variant="outline" size="sm">View</Button>
                  </td>
                </tr>
                <tr class="border-b hover:bg-gray-50">
                  <td class="py-3">Mike Johnson</td>
                  <td class="py-3">Business Registration</td>
                  <td class="py-3 text-sm text-gray-600">Dec 19, 2024, 16:45</td>
                  <td class="py-3">
                    <Badge variant="success">completed</Badge>
                  </td>
                  <td class="py-3">
                    <Button variant="outline" size="sm">View</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card class="hover:shadow-lg transition-shadow cursor-pointer" onclick={() => window.location.href = '/dashboard/ai-settings'}>
          <CardContent class="pt-6">
            <div class="flex items-center space-x-4">
              <div class="p-3 bg-blue-100 rounded-lg">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold">AI Settings</h3>
                <p class="text-sm text-gray-600">Customize AI responses</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card class="hover:shadow-lg transition-shadow cursor-pointer" onclick={() => window.location.href = '/dashboard/leads'}>
          <CardContent class="pt-6">
            <div class="flex items-center space-x-4">
              <div class="p-3 bg-green-100 rounded-lg">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold">Manage Leads</h3>
                <p class="text-sm text-gray-600">View and follow up</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card class="hover:shadow-lg transition-shadow cursor-pointer" onclick={() => window.location.href = '/dashboard/analytics'}>
          <CardContent class="pt-6">
            <div class="flex items-center space-x-4">
              <div class="p-3 bg-purple-100 rounded-lg">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold">Analytics</h3>
                <p class="text-sm text-gray-600">Detailed insights</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    {/if}
  </main>
</div>