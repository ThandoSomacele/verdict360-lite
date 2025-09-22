<script lang="ts">
  import { onMount } from 'svelte';
  import Card from '$lib/components/ui/card.svelte';
  import CardHeader from '$lib/components/ui/card-header.svelte';
  import CardTitle from '$lib/components/ui/card-title.svelte';
  import CardContent from '$lib/components/ui/card-content.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import Input from '$lib/components/ui/input.svelte';
  import Badge from '$lib/components/ui/badge.svelte';
  import { FileText, Download, Eye, Plus, Search, Filter, Calendar, DollarSign, RefreshCw } from 'lucide-svelte';
  import {
    type Invoice,
    initializeInvoiceData,
    formatInvoiceCurrency,
    formatInvoiceDate,
    getInvoiceStatusColor
  } from '$lib/utils/invoiceData';
  import { downloadInvoicePDF } from '$lib/services/invoicePdfService';

  let invoices = $state<Invoice[]>([]);
  let filteredInvoices = $state<Invoice[]>([]);
  let loading = $state(true);
  let searchTerm = $state('');
  let statusFilter = $state('all');
  let dateFilter = $state('all');

  // Summary statistics
  let totalRevenue = $state(0);
  let paidInvoices = $state(0);
  let pendingInvoices = $state(0);
  let overdueInvoices = $state(0);

  onMount(() => {
    loadInvoices();
  });

  function loadInvoices() {
    loading = true;
    try {
      // For demo, we'll use a default tenant ID
      const tenantId = 'tenant-smith';
      const loadedInvoices = initializeInvoiceData(tenantId);
      invoices = loadedInvoices;
      filteredInvoices = loadedInvoices;
      calculateStatistics();
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      loading = false;
    }
  }

  function calculateStatistics() {
    totalRevenue = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total_amount, 0);

    paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
    pendingInvoices = invoices.filter(inv => inv.status === 'pending').length;
    overdueInvoices = invoices.filter(inv => inv.status === 'overdue').length;
  }

  function filterInvoices() {
    let filtered = [...invoices];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(inv =>
        inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(inv => inv.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

      filtered = filtered.filter(inv => {
        const invoiceDate = new Date(inv.issue_date);
        switch (dateFilter) {
          case '30days':
            return invoiceDate >= thirtyDaysAgo;
          case '60days':
            return invoiceDate >= sixtyDaysAgo;
          case '90days':
            return invoiceDate >= ninetyDaysAgo;
          default:
            return true;
        }
      });
    }

    filteredInvoices = filtered;
  }

  $effect(() => {
    filterInvoices();
  });

  function handleDownloadPDF(invoice: Invoice) {
    try {
      downloadInvoicePDF(invoice);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  }

  function handleViewInvoice(invoiceId: string) {
    window.location.href = `/admin/invoices/${invoiceId}`;
  }

  function handleCreateInvoice() {
    window.location.href = '/admin/invoices/new';
  }

  function getStatusBadgeVariant(status: string): string {
    const variants: Record<string, string> = {
      paid: 'success',
      pending: 'warning',
      overdue: 'destructive',
      draft: 'secondary',
      void: 'outline'
    };
    return variants[status] || 'default';
  }
</script>

<svelte:head>
  <title>Invoices - Admin - Verdict 360</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <header class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Invoice Management</h1>
          <p class="text-sm text-gray-500">Manage and track all platform invoices</p>
        </div>
        <div class="flex items-center gap-4">
          <Button variant="outline" onclick={() => window.location.href = '/admin'}>
            Back to Dashboard
          </Button>
          <Button variant="default" onclick={handleCreateInvoice}>
            <Plus class="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total Revenue</p>
              <p class="text-2xl font-bold">{formatInvoiceCurrency(totalRevenue)}</p>
            </div>
            <DollarSign class="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Paid Invoices</p>
              <p class="text-2xl font-bold">{paidInvoices}</p>
            </div>
            <FileText class="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Pending</p>
              <p class="text-2xl font-bold">{pendingInvoices}</p>
            </div>
            <Calendar class="h-8 w-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Overdue</p>
              <p class="text-2xl font-bold">{overdueInvoices}</p>
            </div>
            <FileText class="h-8 w-8 text-red-500" />
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Filters -->
    <Card class="mb-6">
      <CardContent class="py-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                id="search"
                placeholder="Invoice #, customer..."
                bind:value={searchTerm}
                class="pl-10"
              />
            </div>
          </div>

          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              bind:value={statusFilter}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="draft">Draft</option>
              <option value="void">Void</option>
            </select>
          </div>

          <div>
            <label for="date" class="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select
              id="date"
              bind:value={dateFilter}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="30days">Last 30 Days</option>
              <option value="60days">Last 60 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>

          <div class="flex items-end">
            <Button variant="outline" onclick={loadInvoices} class="w-full">
              <RefreshCw class="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Invoices Table -->
    <Card>
      <CardHeader>
        <CardTitle>All Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        {#if loading}
          <div class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        {:else if filteredInvoices.length === 0}
          <div class="text-center py-12">
            <FileText class="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500">No invoices found</p>
          </div>
        {:else}
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-3 px-4 text-sm font-medium text-gray-700">Invoice #</th>
                  <th class="text-left py-3 px-4 text-sm font-medium text-gray-700">Customer</th>
                  <th class="text-left py-3 px-4 text-sm font-medium text-gray-700">Issue Date</th>
                  <th class="text-left py-3 px-4 text-sm font-medium text-gray-700">Due Date</th>
                  <th class="text-left py-3 px-4 text-sm font-medium text-gray-700">Amount</th>
                  <th class="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                  <th class="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {#each filteredInvoices as invoice}
                  <tr class="border-b hover:bg-gray-50">
                    <td class="py-3 px-4">
                      <div class="font-medium text-sm">{invoice.invoice_number}</div>
                    </td>
                    <td class="py-3 px-4">
                      <div>
                        <div class="text-sm font-medium">{invoice.customer.name}</div>
                        <div class="text-xs text-gray-500">{invoice.customer.email}</div>
                      </div>
                    </td>
                    <td class="py-3 px-4 text-sm">
                      {formatInvoiceDate(invoice.issue_date)}
                    </td>
                    <td class="py-3 px-4 text-sm">
                      {formatInvoiceDate(invoice.due_date)}
                    </td>
                    <td class="py-3 px-4">
                      <div class="text-sm font-medium">
                        {formatInvoiceCurrency(invoice.total_amount, invoice.currency)}
                      </div>
                    </td>
                    <td class="py-3 px-4">
                      <Badge variant={getStatusBadgeVariant(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </td>
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onclick={() => handleViewInvoice(invoice.id)}
                        >
                          <Eye class="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onclick={() => handleDownloadPDF(invoice)}
                        >
                          <Download class="h-4 w-4" />
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
              Showing {filteredInvoices.length} of {invoices.length} invoices
            </div>
            <div class="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        {/if}
      </CardContent>
    </Card>
  </main>
</div>