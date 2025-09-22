<script lang="ts">
  import { onMount } from 'svelte';
  import Card from '$lib/components/ui/card.svelte';
  import CardHeader from '$lib/components/ui/card-header.svelte';
  import CardTitle from '$lib/components/ui/card-title.svelte';
  import CardContent from '$lib/components/ui/card-content.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import Input from '$lib/components/ui/input.svelte';
  import Badge from '$lib/components/ui/badge.svelte';
  import { ArrowLeft, Search, Filter, Download, MessageSquare, User, Calendar, Clock, ChevronRight } from 'lucide-svelte';

  interface Conversation {
    id: string;
    client_name: string;
    client_email: string;
    topic: string;
    status: 'active' | 'completed' | 'follow-up';
    messages_count: number;
    created_at: string;
    updated_at: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    lead_captured: boolean;
    appointment_scheduled: boolean;
  }

  let conversations = $state<Conversation[]>([]);
  let filteredConversations = $state<Conversation[]>([]);
  let loading = $state(true);
  let searchTerm = $state('');
  let statusFilter = $state('all');
  let dateFilter = $state('all');
  let currentPage = $state(1);
  let totalPages = $state(1);
  let selectedConversation = $state<Conversation | null>(null);

  onMount(() => {
    fetchConversations();
  });

  async function fetchConversations() {
    loading = true;
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/conversations?page=${currentPage}&status=${statusFilter}&date=${dateFilter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        conversations = data.conversations || getDemoConversations();
        totalPages = data.totalPages || 1;
        filterConversations();
      } else {
        conversations = getDemoConversations();
        filterConversations();
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      conversations = getDemoConversations();
      filterConversations();
    } finally {
      loading = false;
    }
  }

  function getDemoConversations(): Conversation[] {
    return [
      {
        id: '1',
        client_name: 'John Doe',
        client_email: 'john.doe@email.com',
        topic: 'Divorce Consultation',
        status: 'completed',
        messages_count: 24,
        created_at: '2024-12-20T14:30:00Z',
        updated_at: '2024-12-20T15:15:00Z',
        sentiment: 'positive',
        lead_captured: true,
        appointment_scheduled: true
      },
      {
        id: '2',
        client_name: 'Jane Smith',
        client_email: 'jane.smith@email.com',
        topic: 'Property Transfer',
        status: 'follow-up',
        messages_count: 18,
        created_at: '2024-12-20T11:15:00Z',
        updated_at: '2024-12-20T11:45:00Z',
        sentiment: 'neutral',
        lead_captured: true,
        appointment_scheduled: false
      },
      {
        id: '3',
        client_name: 'Mike Johnson',
        client_email: 'mike.j@email.com',
        topic: 'Business Registration',
        status: 'completed',
        messages_count: 32,
        created_at: '2024-12-19T16:45:00Z',
        updated_at: '2024-12-19T17:30:00Z',
        sentiment: 'positive',
        lead_captured: true,
        appointment_scheduled: true
      },
      {
        id: '4',
        client_name: 'Sarah Williams',
        client_email: 'sarah.w@email.com',
        topic: 'Contract Review',
        status: 'active',
        messages_count: 12,
        created_at: '2024-12-21T09:00:00Z',
        updated_at: '2024-12-21T09:15:00Z',
        sentiment: 'neutral',
        lead_captured: false,
        appointment_scheduled: false
      },
      {
        id: '5',
        client_name: 'David Brown',
        client_email: 'david.brown@email.com',
        topic: 'Labour Law Query',
        status: 'completed',
        messages_count: 28,
        created_at: '2024-12-18T13:20:00Z',
        updated_at: '2024-12-18T14:10:00Z',
        sentiment: 'positive',
        lead_captured: true,
        appointment_scheduled: false
      }
    ];
  }

  function filterConversations() {
    filteredConversations = conversations.filter(conv => {
      const matchesSearch = searchTerm === '' ||
        conv.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.client_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.topic.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || conv.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  function getStatusVariant(status: string): 'success' | 'warning' | 'default' {
    switch (status) {
      case 'completed': return 'success';
      case 'follow-up': return 'warning';
      case 'active': return 'default';
      default: return 'default';
    }
  }

  function getSentimentIcon(sentiment: string) {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😟';
      default: return '😐';
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

  function formatDuration(created: string, updated: string) {
    const start = new Date(created);
    const end = new Date(updated);
    const duration = Math.floor((end.getTime() - start.getTime()) / 1000 / 60);
    return `${duration} min`;
  }

  async function exportConversations() {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/conversations/export', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `conversations-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting conversations:', error);
    }
  }

  $effect(() => {
    filterConversations();
  });
</script>

<svelte:head>
  <title>Conversations - Dashboard - Verdict 360</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <header class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <a href="/dashboard" class="mr-4">
            <ArrowLeft class="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </a>
          <h1 class="text-2xl font-bold text-gray-900">Conversations</h1>
        </div>
        <Button on:click={exportConversations}>
          <Download class="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <!-- Filters -->
    <Card class="mb-6">
      <CardContent class="pt-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search by name, email, or topic..."
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
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="follow-up">Follow-up</option>
          </select>
          <select
            bind:value={dateFilter}
            on:change={fetchConversations}
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </CardContent>
    </Card>

    <!-- Conversations List -->
    {#if loading}
      <div class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    {:else if filteredConversations.length === 0}
      <Card>
        <CardContent class="py-12">
          <div class="text-center">
            <MessageSquare class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">No conversations found</h3>
            <p class="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search criteria' : 'Conversations will appear here once clients interact with your chatbot'}
            </p>
          </div>
        </CardContent>
      </Card>
    {:else}
      <div class="space-y-4">
        {#each filteredConversations as conversation}
          <Card class="hover:shadow-lg transition-shadow cursor-pointer" on:click={() => selectedConversation = conversation}>
            <CardContent class="p-6">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-4 mb-2">
                    <h3 class="text-lg font-semibold">{conversation.client_name}</h3>
                    <Badge variant={getStatusVariant(conversation.status)}>
                      {conversation.status}
                    </Badge>
                    <span class="text-2xl" title={`Sentiment: ${conversation.sentiment}`}>
                      {getSentimentIcon(conversation.sentiment)}
                    </span>
                  </div>

                  <div class="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span class="flex items-center gap-1">
                      <User class="h-3 w-3" />
                      {conversation.client_email}
                    </span>
                    <span class="flex items-center gap-1">
                      <MessageSquare class="h-3 w-3" />
                      {conversation.messages_count} messages
                    </span>
                    <span class="flex items-center gap-1">
                      <Clock class="h-3 w-3" />
                      {formatDuration(conversation.created_at, conversation.updated_at)}
                    </span>
                  </div>

                  <p class="text-gray-700 mb-3">{conversation.topic}</p>

                  <div class="flex items-center gap-4">
                    {#if conversation.lead_captured}
                      <Badge variant="outline" class="text-green-600">
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Lead Captured
                      </Badge>
                    {/if}
                    {#if conversation.appointment_scheduled}
                      <Badge variant="outline" class="text-blue-600">
                        <Calendar class="w-3 h-3 mr-1" />
                        Appointment Scheduled
                      </Badge>
                    {/if}
                    <span class="text-xs text-gray-500">
                      Started {formatDate(conversation.created_at)}
                    </span>
                  </div>
                </div>

                <ChevronRight class="h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        {/each}
      </div>

      <!-- Pagination -->
      {#if totalPages > 1}
        <div class="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            on:click={() => {
              currentPage = Math.max(1, currentPage - 1);
              fetchConversations();
            }}
          >
            Previous
          </Button>

          {#each Array(totalPages) as _, i}
            <Button
              variant={currentPage === i + 1 ? 'default' : 'outline'}
              size="sm"
              on:click={() => {
                currentPage = i + 1;
                fetchConversations();
              }}
            >
              {i + 1}
            </Button>
          {/each}

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            on:click={() => {
              currentPage = Math.min(totalPages, currentPage + 1);
              fetchConversations();
            }}
          >
            Next
          </Button>
        </div>
      {/if}
    {/if}

    <!-- Conversation Detail Modal -->
    {#if selectedConversation}
      <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" on:click={() => selectedConversation = null}>
        <div class="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto" on:click|stopPropagation>
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h2 class="text-xl font-bold">{selectedConversation.client_name}</h2>
                <p class="text-sm text-gray-500">{selectedConversation.client_email}</p>
              </div>
              <button on:click={() => selectedConversation = null} class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="space-y-3 mb-6">
              <div class="flex gap-2">
                <Badge variant={getStatusVariant(selectedConversation.status)}>
                  {selectedConversation.status}
                </Badge>
                {#if selectedConversation.lead_captured}
                  <Badge variant="outline" class="text-green-600">Lead Captured</Badge>
                {/if}
                {#if selectedConversation.appointment_scheduled}
                  <Badge variant="outline" class="text-blue-600">Appointment Scheduled</Badge>
                {/if}
              </div>

              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-gray-500">Topic</p>
                  <p class="font-medium">{selectedConversation.topic}</p>
                </div>
                <div>
                  <p class="text-gray-500">Sentiment</p>
                  <p class="font-medium">
                    {getSentimentIcon(selectedConversation.sentiment)} {selectedConversation.sentiment}
                  </p>
                </div>
                <div>
                  <p class="text-gray-500">Messages</p>
                  <p class="font-medium">{selectedConversation.messages_count}</p>
                </div>
                <div>
                  <p class="text-gray-500">Duration</p>
                  <p class="font-medium">{formatDuration(selectedConversation.created_at, selectedConversation.updated_at)}</p>
                </div>
                <div>
                  <p class="text-gray-500">Started</p>
                  <p class="font-medium">{formatDate(selectedConversation.created_at)}</p>
                </div>
                <div>
                  <p class="text-gray-500">Last Activity</p>
                  <p class="font-medium">{formatDate(selectedConversation.updated_at)}</p>
                </div>
              </div>
            </div>

            <div class="flex gap-2">
              <Button class="flex-1">View Full Conversation</Button>
              <Button variant="outline" class="flex-1">Download Transcript</Button>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </main>
</div>