<script lang="ts">
  import { onMount } from 'svelte';
  import Card from '$lib/components/ui/card.svelte';
  import CardHeader from '$lib/components/ui/card-header.svelte';
  import CardTitle from '$lib/components/ui/card-title.svelte';
  import CardContent from '$lib/components/ui/card-content.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import Input from '$lib/components/ui/input.svelte';
  import Badge from '$lib/components/ui/badge.svelte';
  import Label from '$lib/components/ui/label.svelte';
  import { ArrowLeft, Search, Filter, Download, User, Mail, Phone, Calendar, MessageSquare, Star, Clock, ChevronRight } from 'lucide-svelte';

  interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    source: string;
    status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
    score: number;
    created_at: string;
    last_contact: string;
    conversation_topic: string;
    notes: string;
    appointment_scheduled: boolean;
    value: number;
  }

  let leads = $state<Lead[]>([]);
  let filteredLeads = $state<Lead[]>([]);
  let loading = $state(true);
  let searchTerm = $state('');
  let statusFilter = $state('all');
  let sourceFilter = $state('all');
  let selectedLead = $state<Lead | null>(null);
  let editingLead = $state(false);

  let stats = $state({
    total_leads: 0,
    new_leads: 0,
    qualified_leads: 0,
    conversion_rate: 0,
    average_score: 0,
    total_value: 0
  });

  onMount(() => {
    fetchLeads();
    fetchLeadStats();
  });

  async function fetchLeads() {
    loading = true;
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/leads?status=${statusFilter}&source=${sourceFilter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        leads = data.leads || getDemoLeads();
        filterLeads();
      } else {
        leads = getDemoLeads();
        filterLeads();
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      leads = getDemoLeads();
      filterLeads();
    } finally {
      loading = false;
    }
  }

  async function fetchLeadStats() {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/leads/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        stats = data.stats || stats;
      }
    } catch (error) {
      console.error('Error fetching lead stats:', error);
    }
  }

  function getDemoLeads(): Lead[] {
    return [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+27 11 234 5678',
        source: 'Chat Widget',
        status: 'qualified',
        score: 85,
        created_at: '2024-12-20T14:30:00Z',
        last_contact: '2024-12-20T15:15:00Z',
        conversation_topic: 'Divorce proceedings and property division',
        notes: 'High-value client, interested in full representation',
        appointment_scheduled: true,
        value: 25000
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@email.com',
        phone: '+27 12 345 6789',
        source: 'Chat Widget',
        status: 'new',
        score: 72,
        created_at: '2024-12-21T09:00:00Z',
        last_contact: '2024-12-21T09:15:00Z',
        conversation_topic: 'Property transfer consultation',
        notes: 'Needs follow-up call',
        appointment_scheduled: false,
        value: 15000
      },
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike.j@email.com',
        phone: '+27 10 987 6543',
        source: 'Contact Form',
        status: 'converted',
        score: 92,
        created_at: '2024-12-19T16:45:00Z',
        last_contact: '2024-12-20T10:30:00Z',
        conversation_topic: 'Business registration and compliance',
        notes: 'Signed retainer agreement',
        appointment_scheduled: true,
        value: 45000
      },
      {
        id: '4',
        name: 'Sarah Williams',
        email: 'sarah.w@email.com',
        phone: '+27 11 456 7890',
        source: 'Referral',
        status: 'contacted',
        score: 68,
        created_at: '2024-12-18T11:20:00Z',
        last_contact: '2024-12-19T14:00:00Z',
        conversation_topic: 'Employment contract review',
        notes: 'Awaiting documents',
        appointment_scheduled: false,
        value: 8000
      },
      {
        id: '5',
        name: 'David Brown',
        email: 'david.brown@email.com',
        phone: '+27 12 789 0123',
        source: 'Chat Widget',
        status: 'lost',
        score: 45,
        created_at: '2024-12-17T13:20:00Z',
        last_contact: '2024-12-18T09:00:00Z',
        conversation_topic: 'General legal inquiry',
        notes: 'Chose another firm',
        appointment_scheduled: false,
        value: 0
      }
    ];
  }

  function filterLeads() {
    filteredLeads = leads.filter(lead => {
      const matchesSearch = searchTerm === '' ||
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        lead.conversation_topic.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;

      return matchesSearch && matchesStatus && matchesSource;
    });

    // Update stats
    stats.total_leads = filteredLeads.length;
    stats.new_leads = filteredLeads.filter(l => l.status === 'new').length;
    stats.qualified_leads = filteredLeads.filter(l => l.status === 'qualified').length;
    stats.conversion_rate = stats.total_leads > 0
      ? Math.round((filteredLeads.filter(l => l.status === 'converted').length / stats.total_leads) * 100)
      : 0;
    stats.average_score = stats.total_leads > 0
      ? Math.round(filteredLeads.reduce((sum, l) => sum + l.score, 0) / stats.total_leads)
      : 0;
    stats.total_value = filteredLeads.reduce((sum, l) => sum + l.value, 0);
  }

  function getStatusVariant(status: string): 'success' | 'warning' | 'default' | 'destructive' | 'secondary' {
    switch (status) {
      case 'converted': return 'success';
      case 'qualified': return 'warning';
      case 'new': return 'default';
      case 'contacted': return 'secondary';
      case 'lost': return 'destructive';
      default: return 'default';
    }
  }

  function getScoreColor(score: number): string {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  }

  async function updateLeadStatus(leadId: string, status: string) {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        const leadIndex = leads.findIndex(l => l.id === leadId);
        if (leadIndex !== -1) {
          leads[leadIndex].status = status as Lead['status'];
          filterLeads();
        }
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  }

  async function saveLead() {
    if (!selectedLead) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/leads/${selectedLead.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(selectedLead)
      });

      if (response.ok) {
        const leadIndex = leads.findIndex(l => l.id === selectedLead.id);
        if (leadIndex !== -1) {
          leads[leadIndex] = selectedLead;
          filterLeads();
        }
        editingLead = false;
      }
    } catch (error) {
      console.error('Error saving lead:', error);
    }
  }

  async function exportLeads() {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/leads/export', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting leads:', error);
    }
  }

  $: {
    searchTerm;
    statusFilter;
    sourceFilter;
    filterLeads();
  }
</script>

<svelte:head>
  <title>Leads - Dashboard - Verdict 360</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <header class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <a href="/dashboard" class="mr-4">
            <ArrowLeft class="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </a>
          <h1 class="text-2xl font-bold text-gray-900">Lead Management</h1>
        </div>
        <div class="flex gap-2">
          <Button variant="outline" on:click={exportLeads}>
            <Download class="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            Add Lead
          </Button>
        </div>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
      <Card>
        <CardContent class="pt-6">
          <div class="text-2xl font-bold">{stats.total_leads}</div>
          <p class="text-xs text-gray-500">Total Leads</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="pt-6">
          <div class="text-2xl font-bold text-blue-600">{stats.new_leads}</div>
          <p class="text-xs text-gray-500">New Leads</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="pt-6">
          <div class="text-2xl font-bold text-yellow-600">{stats.qualified_leads}</div>
          <p class="text-xs text-gray-500">Qualified</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="pt-6">
          <div class="text-2xl font-bold text-green-600">{stats.conversion_rate}%</div>
          <p class="text-xs text-gray-500">Conversion</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="pt-6">
          <div class="text-2xl font-bold">{stats.average_score}</div>
          <p class="text-xs text-gray-500">Avg Score</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="pt-6">
          <div class="text-xl font-bold">{formatCurrency(stats.total_value)}</div>
          <p class="text-xs text-gray-500">Pipeline Value</p>
        </CardContent>
      </Card>
    </div>

    <!-- Filters -->
    <Card class="mb-6">
      <CardContent class="pt-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search leads..."
                class="pl-10"
                bind:value={searchTerm}
              />
            </div>
          </div>
          <select
            bind:value={statusFilter}
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
          <select
            bind:value={sourceFilter}
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Sources</option>
            <option value="Chat Widget">Chat Widget</option>
            <option value="Contact Form">Contact Form</option>
            <option value="Referral">Referral</option>
            <option value="Direct">Direct</option>
          </select>
        </div>
      </CardContent>
    </Card>

    <!-- Leads Table -->
    {#if loading}
      <div class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    {:else}
      <Card>
        <CardContent class="p-0">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b bg-gray-50">
                  <th class="text-left py-3 px-4 font-medium text-gray-700">Lead</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-700">Score</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-700">Source</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-700">Value</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-700">Created</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {#if filteredLeads.length === 0}
                  <tr>
                    <td colspan="8" class="text-center py-8 text-gray-500">
                      No leads found
                    </td>
                  </tr>
                {:else}
                  {#each filteredLeads as lead}
                    <tr class="border-b hover:bg-gray-50">
                      <td class="py-3 px-4">
                        <div>
                          <p class="font-medium">{lead.name}</p>
                          <p class="text-xs text-gray-500">{lead.conversation_topic}</p>
                        </div>
                      </td>
                      <td class="py-3 px-4">
                        <div class="text-sm">
                          <p class="flex items-center gap-1">
                            <Mail class="h-3 w-3" />
                            {lead.email}
                          </p>
                          <p class="flex items-center gap-1 text-gray-500">
                            <Phone class="h-3 w-3" />
                            {lead.phone}
                          </p>
                        </div>
                      </td>
                      <td class="py-3 px-4">
                        <select
                          value={lead.status}
                          on:change={(e) => updateLeadStatus(lead.id, e.currentTarget.value)}
                          class="px-2 py-1 text-sm border border-gray-300 rounded-md"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="converted">Converted</option>
                          <option value="lost">Lost</option>
                        </select>
                      </td>
                      <td class="py-3 px-4">
                        <div class="flex items-center gap-1">
                          <span class="text-lg font-bold {getScoreColor(lead.score)}">{lead.score}</span>
                          <Star class="h-4 w-4 text-yellow-500" />
                        </div>
                      </td>
                      <td class="py-3 px-4">
                        <Badge variant="outline">{lead.source}</Badge>
                      </td>
                      <td class="py-3 px-4 font-medium">
                        {formatCurrency(lead.value)}
                      </td>
                      <td class="py-3 px-4 text-sm text-gray-500">
                        {formatDate(lead.created_at)}
                      </td>
                      <td class="py-3 px-4">
                        <Button
                          size="sm"
                          variant="outline"
                          on:click={() => {
                            selectedLead = lead;
                            editingLead = false;
                          }}
                        >
                          View
                        </Button>
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

    <!-- Lead Detail Modal -->
    {#if selectedLead}
      <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" on:click={() => selectedLead = null}>
        <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" on:click|stopPropagation>
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h2 class="text-xl font-bold">{selectedLead.name}</h2>
                <Badge variant={getStatusVariant(selectedLead.status)}>
                  {selectedLead.status}
                </Badge>
              </div>
              <button on:click={() => selectedLead = null} class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="space-y-4">
              {#if editingLead}
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <Label for="lead-name">Name</Label>
                    <Input id="lead-name" bind:value={selectedLead.name} />
                  </div>
                  <div>
                    <Label for="lead-email">Email</Label>
                    <Input id="lead-email" type="email" bind:value={selectedLead.email} />
                  </div>
                  <div>
                    <Label for="lead-phone">Phone</Label>
                    <Input id="lead-phone" bind:value={selectedLead.phone} />
                  </div>
                  <div>
                    <Label for="lead-value">Value</Label>
                    <Input id="lead-value" type="number" bind:value={selectedLead.value} />
                  </div>
                </div>
                <div>
                  <Label for="lead-notes">Notes</Label>
                  <textarea
                    id="lead-notes"
                    bind:value={selectedLead.notes}
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  ></textarea>
                </div>
              {:else}
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p class="text-gray-500">Email</p>
                    <p class="font-medium">{selectedLead.email}</p>
                  </div>
                  <div>
                    <p class="text-gray-500">Phone</p>
                    <p class="font-medium">{selectedLead.phone}</p>
                  </div>
                  <div>
                    <p class="text-gray-500">Source</p>
                    <p class="font-medium">{selectedLead.source}</p>
                  </div>
                  <div>
                    <p class="text-gray-500">Score</p>
                    <p class="font-medium">{selectedLead.score}/100</p>
                  </div>
                  <div>
                    <p class="text-gray-500">Pipeline Value</p>
                    <p class="font-medium">{formatCurrency(selectedLead.value)}</p>
                  </div>
                  <div>
                    <p class="text-gray-500">Created</p>
                    <p class="font-medium">{formatDate(selectedLead.created_at)}</p>
                  </div>
                  <div>
                    <p class="text-gray-500">Last Contact</p>
                    <p class="font-medium">{formatDate(selectedLead.last_contact)}</p>
                  </div>
                  <div>
                    <p class="text-gray-500">Appointment</p>
                    <p class="font-medium">{selectedLead.appointment_scheduled ? 'Scheduled' : 'Not scheduled'}</p>
                  </div>
                </div>

                <div>
                  <p class="text-gray-500 text-sm mb-1">Conversation Topic</p>
                  <p class="font-medium">{selectedLead.conversation_topic}</p>
                </div>

                <div>
                  <p class="text-gray-500 text-sm mb-1">Notes</p>
                  <p class="text-gray-700">{selectedLead.notes}</p>
                </div>
              {/if}

              <div class="flex gap-2 pt-4 border-t">
                {#if editingLead}
                  <Button on:click={saveLead}>Save Changes</Button>
                  <Button variant="outline" on:click={() => editingLead = false}>Cancel</Button>
                {:else}
                  <Button on:click={() => editingLead = true}>Edit Lead</Button>
                  <Button variant="outline">Send Email</Button>
                  <Button variant="outline">Schedule Call</Button>
                  {#if !selectedLead.appointment_scheduled}
                    <Button variant="outline">Book Appointment</Button>
                  {/if}
                {/if}
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </main>
</div>