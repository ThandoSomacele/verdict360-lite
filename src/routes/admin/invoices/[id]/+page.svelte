<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import Card from '$lib/components/ui/card.svelte';
  import CardHeader from '$lib/components/ui/card-header.svelte';
  import CardTitle from '$lib/components/ui/card-title.svelte';
  import CardContent from '$lib/components/ui/card-content.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import Badge from '$lib/components/ui/badge.svelte';
  import { ArrowLeft, Download, Send, Printer, Edit, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-svelte';
  import {
    type Invoice,
    getInvoiceById,
    formatInvoiceCurrency,
    formatInvoiceDate,
    updateInvoiceStatus
  } from '$lib/utils/invoiceData';
  import { downloadInvoicePDF } from '$lib/services/invoicePdfService';

  let invoice = $state<Invoice | null>(null);
  let loading = $state(true);
  let invoiceId = $derived(page.params.id);

  onMount(() => {
    loadInvoice();
  });

  $effect(() => {
    if (invoiceId) {
      loadInvoice();
    }
  });

  function loadInvoice() {
    if (!invoiceId) return;

    loading = true;
    try {
      // For demo, using default tenant ID
      const tenantId = 'tenant-smith';
      invoice = getInvoiceById(tenantId, invoiceId);
    } catch (error) {
      console.error('Error loading invoice:', error);
    } finally {
      loading = false;
    }
  }

  function handleDownloadPDF() {
    if (invoice) {
      try {
        downloadInvoicePDF(invoice);
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
      }
    }
  }

  function handlePrint() {
    window.print();
  }

  function handleSendEmail() {
    alert('Email functionality would be implemented here');
  }

  function handleMarkAsPaid() {
    if (invoice && confirm('Mark this invoice as paid?')) {
      const tenantId = 'tenant-smith';
      updateInvoiceStatus(tenantId, invoice.id, 'paid');
      loadInvoice();
    }
  }

  function handleVoidInvoice() {
    if (invoice && confirm('Void this invoice? This action cannot be undone.')) {
      const tenantId = 'tenant-smith';
      updateInvoiceStatus(tenantId, invoice.id, 'void');
      loadInvoice();
    }
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

  function getStatusIcon(status: string) {
    switch (status) {
      case 'paid':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'overdue':
        return XCircle;
      default:
        return DollarSign;
    }
  }
</script>

<svelte:head>
  <title>{invoice ? `Invoice ${invoice.invoice_number}` : 'Loading...'} - Admin - Verdict 360</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 print:bg-white">
  <header class="bg-white shadow-sm border-b print:hidden">
    <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <a href="/admin/invoices" class="mr-4">
            <ArrowLeft class="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </a>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              {invoice ? `Invoice ${invoice.invoice_number}` : 'Loading...'}
            </h1>
            {#if invoice}
              <p class="text-sm text-gray-500">
                Issued on {formatInvoiceDate(invoice.issue_date)}
              </p>
            {/if}
          </div>
        </div>
        {#if invoice}
          <div class="flex items-center gap-2">
            {#if invoice.status === 'pending'}
              <Button variant="success" onclick={handleMarkAsPaid}>
                <CheckCircle class="h-4 w-4 mr-2" />
                Mark as Paid
              </Button>
            {/if}
            {#if invoice.status !== 'void'}
              <Button variant="destructive" onclick={handleVoidInvoice}>
                <XCircle class="h-4 w-4 mr-2" />
                Void Invoice
              </Button>
            {/if}
            <Button variant="outline" onclick={handleSendEmail}>
              <Send class="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button variant="outline" onclick={handlePrint}>
              <Printer class="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="default" onclick={handleDownloadPDF}>
              <Download class="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        {/if}
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 print:max-w-full">
    {#if loading}
      <div class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    {:else if !invoice}
      <Card>
        <CardContent class="py-12">
          <div class="text-center">
            <p class="text-gray-500">Invoice not found</p>
            <Button variant="outline" onclick={() => window.location.href = '/admin/invoices'} class="mt-4">
              Back to Invoices
            </Button>
          </div>
        </CardContent>
      </Card>
    {:else}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Invoice Content -->
        <div class="lg:col-span-2">
          <Card class="print:shadow-none">
            <CardContent class="p-8">
              <!-- Header -->
              <div class="flex justify-between items-start mb-8">
                <div>
                  <h2 class="text-3xl font-bold text-blue-600 mb-2">VERDICT 360</h2>
                  <p class="text-sm text-gray-600">AI-Powered Legal Solutions</p>
                  <p class="text-sm text-gray-600">Johannesburg, South Africa</p>
                  <p class="text-sm text-gray-600">VAT: 123456789</p>
                  <p class="text-sm text-gray-600">info@verdict360.com | +27 11 234 5678</p>
                </div>
                <div class="text-right">
                  <h3 class="text-2xl font-bold mb-2">INVOICE</h3>
                  <p class="text-sm text-gray-600">Invoice #: {invoice.invoice_number}</p>
                  <p class="text-sm text-gray-600">Date: {formatInvoiceDate(invoice.issue_date)}</p>
                  <p class="text-sm text-gray-600">Due Date: {formatInvoiceDate(invoice.due_date)}</p>
                  <div class="mt-2">
                    <Badge variant={getStatusBadgeVariant(invoice.status)} class="text-xs">
                      {invoice.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              <hr class="my-6" />

              <!-- Bill To -->
              <div class="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 class="font-semibold text-gray-700 mb-2">BILL TO:</h4>
                  <p class="font-medium">{invoice.customer.name}</p>
                  {#if invoice.customer.address}
                    <p class="text-sm text-gray-600">{invoice.customer.address}</p>
                  {/if}
                  {#if invoice.customer.city}
                    <p class="text-sm text-gray-600">{invoice.customer.city}, {invoice.customer.postal_code || ''}</p>
                  {/if}
                  <p class="text-sm text-gray-600">{invoice.customer.email}</p>
                  {#if invoice.customer.phone}
                    <p class="text-sm text-gray-600">{invoice.customer.phone}</p>
                  {/if}
                  {#if invoice.customer.vat_number}
                    <p class="text-sm text-gray-600">VAT: {invoice.customer.vat_number}</p>
                  {/if}
                </div>
                {#if invoice.billing_period}
                  <div>
                    <h4 class="font-semibold text-gray-700 mb-2">BILLING PERIOD:</h4>
                    <p class="text-sm text-gray-600">From: {formatInvoiceDate(invoice.billing_period.start)}</p>
                    <p class="text-sm text-gray-600">To: {formatInvoiceDate(invoice.billing_period.end)}</p>
                  </div>
                {/if}
              </div>

              <!-- Line Items -->
              <div class="mb-8">
                <table class="w-full">
                  <thead>
                    <tr class="border-b-2 border-gray-200">
                      <th class="text-left py-2 text-sm font-semibold text-gray-700">Description</th>
                      <th class="text-center py-2 text-sm font-semibold text-gray-700">Qty</th>
                      <th class="text-right py-2 text-sm font-semibold text-gray-700">Unit Price</th>
                      <th class="text-right py-2 text-sm font-semibold text-gray-700">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each invoice.line_items as item}
                      <tr class="border-b">
                        <td class="py-3 text-sm">{item.description}</td>
                        <td class="py-3 text-sm text-center">{item.quantity}</td>
                        <td class="py-3 text-sm text-right">{formatInvoiceCurrency(item.unit_price, invoice.currency)}</td>
                        <td class="py-3 text-sm text-right font-medium">{formatInvoiceCurrency(item.amount, invoice.currency)}</td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>

              <!-- Summary -->
              <div class="flex justify-end">
                <div class="w-64">
                  <div class="flex justify-between py-2 text-sm">
                    <span>Subtotal:</span>
                    <span>{formatInvoiceCurrency(invoice.subtotal, invoice.currency)}</span>
                  </div>
                  <div class="flex justify-between py-2 text-sm">
                    <span>VAT (15%):</span>
                    <span>{formatInvoiceCurrency(invoice.tax_amount, invoice.currency)}</span>
                  </div>
                  <div class="flex justify-between py-2 text-lg font-bold border-t-2 border-gray-200">
                    <span>Total Due:</span>
                    <span class="text-blue-600">{formatInvoiceCurrency(invoice.total_amount, invoice.currency)}</span>
                  </div>
                </div>
              </div>

              <!-- Notes & Terms -->
              {#if invoice.notes || invoice.terms}
                <div class="mt-8 pt-6 border-t">
                  {#if invoice.notes}
                    <div class="mb-4">
                      <h4 class="font-semibold text-gray-700 mb-2">Notes:</h4>
                      <p class="text-sm text-gray-600">{invoice.notes}</p>
                    </div>
                  {/if}
                  {#if invoice.terms}
                    <div>
                      <h4 class="font-semibold text-gray-700 mb-2">Terms & Conditions:</h4>
                      <p class="text-sm text-gray-600">{invoice.terms}</p>
                    </div>
                  {/if}
                </div>
              {/if}

              <!-- Footer -->
              <div class="mt-8 pt-6 border-t text-center text-sm text-gray-500">
                <p>Thank you for your business!</p>
                <p>This is a computer-generated invoice and does not require a signature.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Invoice Details Sidebar -->
        <div class="print:hidden">
          <Card class="mb-6">
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl class="space-y-3">
                <div>
                  <dt class="text-sm text-gray-500">Status</dt>
                  <dd class="mt-1 flex items-center gap-2">
                    {#if invoice.status === 'paid'}
                      <CheckCircle class="h-5 w-5 text-green-500" />
                    {:else if invoice.status === 'pending'}
                      <Clock class="h-5 w-5 text-yellow-500" />
                    {:else if invoice.status === 'overdue'}
                      <XCircle class="h-5 w-5 text-red-500" />
                    {:else}
                      <DollarSign class="h-5 w-5 text-gray-500" />
                    {/if}
                    <Badge variant={getStatusBadgeVariant(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </dd>
                </div>

                {#if invoice.paid_date}
                  <div>
                    <dt class="text-sm text-gray-500">Paid Date</dt>
                    <dd class="mt-1 font-medium">{formatInvoiceDate(invoice.paid_date)}</dd>
                  </div>
                {/if}

                {#if invoice.payment_method}
                  <div>
                    <dt class="text-sm text-gray-500">Payment Method</dt>
                    <dd class="mt-1 font-medium">{invoice.payment_method.replace('_', ' ').toUpperCase()}</dd>
                  </div>
                {/if}

                {#if invoice.stripe_invoice_id}
                  <div>
                    <dt class="text-sm text-gray-500">Stripe Invoice ID</dt>
                    <dd class="mt-1 font-mono text-xs">{invoice.stripe_invoice_id}</dd>
                  </div>
                {/if}

                <div>
                  <dt class="text-sm text-gray-500">Created</dt>
                  <dd class="mt-1 font-medium">{formatInvoiceDate(invoice.created_at)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <!-- Quick Actions -->
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-2">
                <Button variant="outline" onclick={() => window.location.href = '/admin/invoices'} class="w-full">
                  <ArrowLeft class="h-4 w-4 mr-2" />
                  Back to Invoices
                </Button>
                <Button variant="outline" onclick={() => window.location.href = `/admin/invoices/${invoice.id}/edit`} class="w-full">
                  <Edit class="h-4 w-4 mr-2" />
                  Edit Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    {/if}
  </main>
</div>

<style>
  @media print {
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  }
</style>