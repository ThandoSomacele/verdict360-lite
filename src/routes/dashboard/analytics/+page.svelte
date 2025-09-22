<script lang="ts">
  import { onMount } from 'svelte';
  import Card from '$lib/components/ui/card.svelte';
  import CardHeader from '$lib/components/ui/card-header.svelte';
  import CardTitle from '$lib/components/ui/card-title.svelte';
  import CardContent from '$lib/components/ui/card-content.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import Badge from '$lib/components/ui/badge.svelte';
  import { ArrowLeft, Download, TrendingUp, TrendingDown, Users, MessageSquare, Calendar, Clock, DollarSign, BarChart3, PieChart, Activity } from 'lucide-svelte';

  let dateRange = $state('month');
  let loading = $state(true);

  let metrics = $state({
    conversations: {
      total: 1234,
      trend: 12,
      daily_avg: 41,
      peak_hour: '14:00',
      avg_duration: '8.5 min'
    },
    leads: {
      total: 234,
      conversion_rate: 18.5,
      trend: 8,
      qualified: 89,
      avg_score: 72
    },
    appointments: {
      total: 67,
      scheduled: 45,
      completed: 22,
      no_show: 3,
      conversion_rate: 32.8
    },
    revenue: {
      total: 450000,
      trend: 15,
      avg_deal_size: 25000,
      pipeline: 1200000,
      closed_deals: 18
    },
    engagement: {
      satisfaction_score: 4.5,
      response_time: '1.2s',
      resolution_rate: 87,
      escalation_rate: 12,
      repeat_visitors: 34
    }
  });

  let topQueries = $state([
    { query: 'Divorce process', count: 145, percentage: 11.8 },
    { query: 'Property transfer', count: 132, percentage: 10.7 },
    { query: 'Business registration', count: 98, percentage: 7.9 },
    { query: 'Employment contracts', count: 87, percentage: 7.1 },
    { query: 'Will and testament', count: 76, percentage: 6.2 }
  ]);

  let hourlyActivity = $state([
    { hour: '08:00', conversations: 12 },
    { hour: '09:00', conversations: 24 },
    { hour: '10:00', conversations: 35 },
    { hour: '11:00', conversations: 42 },
    { hour: '12:00', conversations: 38 },
    { hour: '13:00', conversations: 30 },
    { hour: '14:00', conversations: 48 },
    { hour: '15:00', conversations: 45 },
    { hour: '16:00', conversations: 40 },
    { hour: '17:00', conversations: 28 }
  ]);

  let sourceBreakdown = $state([
    { source: 'Chat Widget', count: 145, percentage: 62, color: 'bg-blue-500' },
    { source: 'Direct Message', count: 56, percentage: 24, color: 'bg-green-500' },
    { source: 'Contact Form', count: 23, percentage: 10, color: 'bg-yellow-500' },
    { source: 'Phone', count: 10, percentage: 4, color: 'bg-purple-500' }
  ]);

  let conversionFunnel = $state([
    { stage: 'Visitors', count: 5234, percentage: 100 },
    { stage: 'Engaged', count: 1234, percentage: 23.6 },
    { stage: 'Leads', count: 234, percentage: 4.5 },
    { stage: 'Qualified', count: 89, percentage: 1.7 },
    { stage: 'Customers', count: 18, percentage: 0.3 }
  ]);

  onMount(() => {
    fetchAnalytics();
  });

  async function fetchAnalytics() {
    loading = true;
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/analytics?range=${dateRange}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.metrics) metrics = data.metrics;
        if (data.topQueries) topQueries = data.topQueries;
        if (data.hourlyActivity) hourlyActivity = data.hourlyActivity;
        if (data.sourceBreakdown) sourceBreakdown = data.sourceBreakdown;
        if (data.conversionFunnel) conversionFunnel = data.conversionFunnel;
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      loading = false;
    }
  }

  async function exportReport() {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/analytics/export?range=${dateRange}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-report-${dateRange}-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0
    }).format(amount);
  }

  function formatNumber(num: number): string {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  }

  $: {
    dateRange;
    fetchAnalytics();
  }
</script>

<svelte:head>
  <title>Analytics - Dashboard - Verdict 360</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <header class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <a href="/dashboard" class="mr-4">
            <ArrowLeft class="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </a>
          <h1 class="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        </div>
        <div class="flex gap-2">
          <select
            bind:value={dateRange}
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <Button on:click={exportReport}>
            <Download class="h-4 w-4 mr-2" />
            Export Report
          </Button>
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
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Total Conversations</CardTitle>
            <MessageSquare class="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{formatNumber(metrics.conversations.total)}</div>
            <div class="flex items-center text-xs">
              {#if metrics.conversations.trend > 0}
                <TrendingUp class="h-3 w-3 text-green-500 mr-1" />
                <span class="text-green-500">+{metrics.conversations.trend}%</span>
              {:else}
                <TrendingDown class="h-3 w-3 text-red-500 mr-1" />
                <span class="text-red-500">{metrics.conversations.trend}%</span>
              {/if}
              <span class="text-gray-500 ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Leads Generated</CardTitle>
            <Users class="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{metrics.leads.total}</div>
            <div class="flex items-center text-xs">
              <span class="text-green-500">+{metrics.leads.trend}%</span>
              <span class="text-gray-500 ml-1">• {metrics.leads.conversion_rate}% conversion</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Appointments</CardTitle>
            <Calendar class="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{metrics.appointments.total}</div>
            <div class="text-xs text-gray-500">
              {metrics.appointments.completed} completed • {metrics.appointments.scheduled} scheduled
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Revenue</CardTitle>
            <DollarSign class="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{formatCurrency(metrics.revenue.total)}</div>
            <div class="flex items-center text-xs">
              <TrendingUp class="h-3 w-3 text-green-500 mr-1" />
              <span class="text-green-500">+{metrics.revenue.trend}%</span>
              <span class="text-gray-500 ml-1">• {metrics.revenue.closed_deals} deals</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- Hourly Activity Chart -->
        <Card class="lg:col-span-2">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Activity class="h-5 w-5" />
              Hourly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="h-64 flex items-end justify-between gap-2">
              {#each hourlyActivity as hour}
                <div class="flex-1 flex flex-col items-center">
                  <div
                    class="w-full bg-primary-500 rounded-t"
                    style="height: {(hour.conversations / 50) * 100}%"
                    title="{hour.conversations} conversations"
                  ></div>
                  <span class="text-xs text-gray-500 mt-1 -rotate-45 origin-left">{hour.hour}</span>
                </div>
              {/each}
            </div>
            <div class="mt-4 text-sm text-gray-600">
              Peak hour: <span class="font-medium">{metrics.conversations.peak_hour}</span> •
              Daily average: <span class="font-medium">{metrics.conversations.daily_avg} conversations</span>
            </div>
          </CardContent>
        </Card>

        <!-- Engagement Metrics -->
        <Card>
          <CardHeader>
            <CardTitle>Engagement Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Satisfaction Score</span>
                <div class="flex items-center gap-1">
                  <span class="font-bold">{metrics.engagement.satisfaction_score}</span>
                  <span class="text-yellow-500">★</span>
                </div>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Avg Response Time</span>
                <span class="font-bold">{metrics.engagement.response_time}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Resolution Rate</span>
                <span class="font-bold text-green-600">{metrics.engagement.resolution_rate}%</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Escalation Rate</span>
                <span class="font-bold text-yellow-600">{metrics.engagement.escalation_rate}%</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Repeat Visitors</span>
                <span class="font-bold">{metrics.engagement.repeat_visitors}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Top Queries -->
        <Card>
          <CardHeader>
            <CardTitle>Top Queries</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              {#each topQueries as query, index}
                <div class="flex items-center gap-3">
                  <span class="text-sm font-medium text-gray-500 w-4">{index + 1}</span>
                  <div class="flex-1">
                    <div class="flex justify-between items-center mb-1">
                      <span class="text-sm font-medium">{query.query}</span>
                      <span class="text-sm text-gray-500">{query.count}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-primary-500 h-2 rounded-full" style="width: {query.percentage}%"></div>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </CardContent>
        </Card>

        <!-- Source Breakdown -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <PieChart class="h-5 w-5" />
              Traffic Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              {#each sourceBreakdown as source}
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full {source.color}"></div>
                    <span class="text-sm font-medium">{source.source}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-gray-500">{source.count}</span>
                    <Badge variant="outline">{source.percentage}%</Badge>
                  </div>
                </div>
              {/each}
            </div>
            <div class="mt-4 pt-4 border-t">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Total Sources</span>
                <span class="font-bold">{sourceBreakdown.reduce((sum, s) => sum + s.count, 0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Conversion Funnel -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <BarChart3 class="h-5 w-5" />
            Conversion Funnel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            {#each conversionFunnel as stage, index}
              <div class="relative">
                <div class="flex justify-between items-center mb-1">
                  <span class="text-sm font-medium">{stage.stage}</span>
                  <span class="text-sm text-gray-500">{stage.count.toLocaleString()} ({stage.percentage}%)</span>
                </div>
                <div class="w-full bg-gray-200 rounded h-8">
                  <div
                    class="h-8 rounded flex items-center px-2 text-white text-xs font-medium {
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-indigo-500' :
                      index === 2 ? 'bg-purple-500' :
                      index === 3 ? 'bg-pink-500' :
                      'bg-green-500'
                    }"
                    style="width: {stage.percentage}%"
                  >
                    {#if stage.percentage > 10}
                      {stage.percentage}%
                    {/if}
                  </div>
                </div>
                {#if index < conversionFunnel.length - 1}
                  <div class="text-center py-1">
                    <svg class="w-4 h-4 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                {/if}
              </div>
            {/each}
          </div>
          <div class="mt-4 pt-4 border-t grid grid-cols-3 gap-4 text-center">
            <div>
              <p class="text-xs text-gray-500">Visitor to Lead</p>
              <p class="font-bold text-lg">{((conversionFunnel[2].count / conversionFunnel[0].count) * 100).toFixed(1)}%</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Lead to Qualified</p>
              <p class="font-bold text-lg">{((conversionFunnel[3].count / conversionFunnel[2].count) * 100).toFixed(1)}%</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Qualified to Customer</p>
              <p class="font-bold text-lg">{((conversionFunnel[4].count / conversionFunnel[3].count) * 100).toFixed(1)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Performance Summary -->
      <Card class="mt-6">
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-600 mb-1">Avg Conversation Duration</p>
              <p class="text-2xl font-bold">{metrics.conversations.avg_duration}</p>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-600 mb-1">Lead Score Average</p>
              <p class="text-2xl font-bold">{metrics.leads.avg_score}/100</p>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-600 mb-1">Avg Deal Size</p>
              <p class="text-2xl font-bold">{formatCurrency(metrics.revenue.avg_deal_size)}</p>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-600 mb-1">Pipeline Value</p>
              <p class="text-2xl font-bold">{formatCurrency(metrics.revenue.pipeline)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    {/if}
  </main>
</div>