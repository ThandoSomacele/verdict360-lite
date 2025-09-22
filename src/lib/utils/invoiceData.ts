// Invoice data model and utilities for Verdict 360

export interface Invoice {
  id: string;
  tenant_id: string;
  invoice_number: string;
  stripe_invoice_id?: string;
  status: 'draft' | 'pending' | 'paid' | 'overdue' | 'void';
  issue_date: string;
  due_date: string;
  paid_date?: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  payment_method?: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    vat_number?: string;
  };
  billing_period?: {
    start: string;
    end: string;
  };
  line_items: InvoiceLineItem[];
  notes?: string;
  terms?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceLineItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  tax_rate?: number;
  tax_amount?: number;
}

// Generate demo invoices for testing
export function generateDemoInvoices(tenantId: string): Invoice[] {
  const now = new Date();
  const invoices: Invoice[] = [];

  // Generate invoices for the last 6 months
  for (let i = 0; i < 6; i++) {
    const issueDate = new Date(now);
    issueDate.setMonth(issueDate.getMonth() - i);
    issueDate.setDate(1);

    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + 30);

    const paidDate = i > 0 ? new Date(dueDate) : undefined;
    if (paidDate) {
      paidDate.setDate(paidDate.getDate() - Math.floor(Math.random() * 15));
    }

    const status = i === 0 ? 'pending' : 'paid';
    const planType = ['Starter', 'Professional', 'Enterprise'][Math.floor(Math.random() * 3)];
    const planPrice = planType === 'Starter' ? 2999 : planType === 'Professional' ? 7999 : 24999;

    const invoice: Invoice = {
      id: `inv_${tenantId}_${i}`,
      tenant_id: tenantId,
      invoice_number: `INV-${now.getFullYear()}${String(now.getMonth() + 1 - i).padStart(2, '0')}-${String(i + 1).padStart(4, '0')}`,
      stripe_invoice_id: i > 0 ? `in_${Math.random().toString(36).substring(7)}` : undefined,
      status: status,
      issue_date: issueDate.toISOString(),
      due_date: dueDate.toISOString(),
      paid_date: paidDate?.toISOString(),
      subtotal: planPrice,
      tax_amount: planPrice * 0.15, // 15% VAT
      total_amount: planPrice * 1.15,
      currency: 'ZAR',
      payment_method: i > 0 ? 'credit_card' : undefined,
      customer: {
        name: 'Sample Law Firm',
        email: 'billing@lawfirm.co.za',
        phone: '+27 11 234 5678',
        address: '123 Legal Street, Sandton',
        city: 'Johannesburg',
        postal_code: '2196',
        vat_number: 'VAT123456789'
      },
      billing_period: {
        start: issueDate.toISOString(),
        end: dueDate.toISOString()
      },
      line_items: [
        {
          description: `Verdict 360 ${planType} Plan - Monthly Subscription`,
          quantity: 1,
          unit_price: planPrice,
          amount: planPrice,
          tax_rate: 15,
          tax_amount: planPrice * 0.15
        }
      ],
      notes: 'Thank you for your continued business.',
      terms: 'Payment is due within 30 days of invoice date.',
      created_at: issueDate.toISOString(),
      updated_at: issueDate.toISOString()
    };

    // Add additional line items for some invoices
    if (Math.random() > 0.7) {
      invoice.line_items.push({
        description: 'Additional User Licenses (5 users)',
        quantity: 5,
        unit_price: 299,
        amount: 1495,
        tax_rate: 15,
        tax_amount: 1495 * 0.15
      });
      invoice.subtotal += 1495;
      invoice.tax_amount = invoice.subtotal * 0.15;
      invoice.total_amount = invoice.subtotal * 1.15;
    }

    invoices.push(invoice);
  }

  return invoices;
}

// Format currency for display
export function formatInvoiceCurrency(amount: number, currency: string = 'ZAR'): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

// Format invoice date
export function formatInvoiceDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Calculate invoice totals
export function calculateInvoiceTotals(lineItems: InvoiceLineItem[]): {
  subtotal: number;
  taxAmount: number;
  total: number;
} {
  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = lineItems.reduce((sum, item) => sum + (item.tax_amount || 0), 0);
  const total = subtotal + taxAmount;

  return { subtotal, taxAmount, total };
}

// Get invoice status badge color
export function getInvoiceStatusColor(status: Invoice['status']): string {
  const colors = {
    draft: 'gray',
    pending: 'yellow',
    paid: 'green',
    overdue: 'red',
    void: 'gray'
  };
  return colors[status] || 'gray';
}

// Initialize invoice data in localStorage
export function initializeInvoiceData(tenantId: string) {
  const existingInvoices = localStorage.getItem(`invoices_${tenantId}`);
  if (!existingInvoices) {
    const demoInvoices = generateDemoInvoices(tenantId);
    localStorage.setItem(`invoices_${tenantId}`, JSON.stringify(demoInvoices));
  }
  return JSON.parse(localStorage.getItem(`invoices_${tenantId}`) || '[]');
}

// Get all invoices for a tenant
export function getInvoicesByTenant(tenantId: string): Invoice[] {
  return JSON.parse(localStorage.getItem(`invoices_${tenantId}`) || '[]');
}

// Get a single invoice
export function getInvoiceById(tenantId: string, invoiceId: string): Invoice | null {
  const invoices = getInvoicesByTenant(tenantId);
  return invoices.find(inv => inv.id === invoiceId) || null;
}

// Update invoice status
export function updateInvoiceStatus(tenantId: string, invoiceId: string, status: Invoice['status']): boolean {
  const invoices = getInvoicesByTenant(tenantId);
  const index = invoices.findIndex(inv => inv.id === invoiceId);

  if (index !== -1) {
    invoices[index].status = status;
    if (status === 'paid') {
      invoices[index].paid_date = new Date().toISOString();
    }
    localStorage.setItem(`invoices_${tenantId}`, JSON.stringify(invoices));
    return true;
  }

  return false;
}