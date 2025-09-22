// Invoice PDF Generation Service using jsPDF
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { Invoice } from '$lib/utils/invoiceData';
import { formatInvoiceCurrency, formatInvoiceDate } from '$lib/utils/invoiceData';

// Extend jsPDF type for autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}

export function generateInvoicePDF(invoice: Invoice): jsPDF {
  const doc = new jsPDF();

  // Company colors
  const primaryColor = [37, 99, 235]; // Blue
  const darkColor = [31, 41, 55]; // Dark gray
  const lightGray = [107, 114, 128];

  // Add logo and company info
  doc.setFontSize(24);
  doc.setTextColor(...primaryColor);
  doc.text('VERDICT 360', 20, 25);

  doc.setFontSize(10);
  doc.setTextColor(...lightGray);
  doc.text('AI-Powered Legal Solutions', 20, 32);
  doc.text('Johannesburg, South Africa', 20, 37);
  doc.text('VAT: 123456789', 20, 42);
  doc.text('info@verdict360.com | +27 11 234 5678', 20, 47);

  // Invoice title and number
  doc.setFontSize(20);
  doc.setTextColor(...darkColor);
  doc.text('INVOICE', 140, 25);

  doc.setFontSize(10);
  doc.setTextColor(...lightGray);
  doc.text(`Invoice #: ${invoice.invoice_number}`, 140, 32);
  doc.text(`Date: ${formatInvoiceDate(invoice.issue_date)}`, 140, 37);
  doc.text(`Due Date: ${formatInvoiceDate(invoice.due_date)}`, 140, 42);

  // Status badge
  const statusColors: Record<string, number[]> = {
    paid: [34, 197, 94],
    pending: [250, 204, 21],
    overdue: [239, 68, 68],
    draft: [107, 114, 128],
    void: [107, 114, 128]
  };

  const statusColor = statusColors[invoice.status] || lightGray;
  doc.setFillColor(...statusColor);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  const statusText = invoice.status.toUpperCase();
  const statusWidth = doc.getTextWidth(statusText) + 6;
  doc.roundedRect(140, 45, statusWidth, 6, 1, 1, 'F');
  doc.text(statusText, 143, 49);

  // Add separator line
  doc.setDrawColor(...lightGray);
  doc.line(20, 55, 190, 55);

  // Bill To section
  doc.setFontSize(12);
  doc.setTextColor(...darkColor);
  doc.text('BILL TO:', 20, 65);

  doc.setFontSize(10);
  doc.setTextColor(...darkColor);
  doc.text(invoice.customer.name, 20, 72);

  doc.setTextColor(...lightGray);
  if (invoice.customer.address) {
    doc.text(invoice.customer.address, 20, 77);
  }
  if (invoice.customer.city) {
    doc.text(`${invoice.customer.city}, ${invoice.customer.postal_code || ''}`, 20, 82);
  }
  doc.text(invoice.customer.email, 20, 87);
  if (invoice.customer.phone) {
    doc.text(invoice.customer.phone, 20, 92);
  }
  if (invoice.customer.vat_number) {
    doc.text(`VAT: ${invoice.customer.vat_number}`, 20, 97);
  }

  // Billing Period (if applicable)
  if (invoice.billing_period) {
    doc.setFontSize(10);
    doc.setTextColor(...darkColor);
    doc.text('BILLING PERIOD:', 140, 65);
    doc.setTextColor(...lightGray);
    doc.text(`${formatInvoiceDate(invoice.billing_period.start)}`, 140, 72);
    doc.text(`to ${formatInvoiceDate(invoice.billing_period.end)}`, 140, 77);
  }

  // Line items table
  const tableStartY = 110;

  doc.autoTable({
    startY: tableStartY,
    head: [['Description', 'Qty', 'Unit Price', 'Amount']],
    body: invoice.line_items.map(item => [
      item.description,
      item.quantity.toString(),
      formatInvoiceCurrency(item.unit_price, invoice.currency),
      formatInvoiceCurrency(item.amount, invoice.currency)
    ]),
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold'
    },
    bodyStyles: {
      textColor: darkColor,
      fontSize: 9
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 35, halign: 'right' }
    },
    margin: { left: 20, right: 20 },
    theme: 'plain'
  });

  // Summary section
  const summaryY = doc.lastAutoTable.finalY + 10;

  // Summary box
  doc.setFillColor(248, 250, 252);
  doc.rect(110, summaryY, 80, 35, 'F');

  // Summary lines
  doc.setFontSize(10);
  doc.setTextColor(...lightGray);
  doc.text('Subtotal:', 115, summaryY + 8);
  doc.text(formatInvoiceCurrency(invoice.subtotal, invoice.currency), 185, summaryY + 8, { align: 'right' });

  doc.text('VAT (15%):', 115, summaryY + 16);
  doc.text(formatInvoiceCurrency(invoice.tax_amount, invoice.currency), 185, summaryY + 16, { align: 'right' });

  // Total line
  doc.setDrawColor(...primaryColor);
  doc.line(115, summaryY + 22, 185, summaryY + 22);

  doc.setFontSize(12);
  doc.setTextColor(...darkColor);
  doc.setFont('helvetica', 'bold');
  doc.text('Total Due:', 115, summaryY + 30);
  doc.text(formatInvoiceCurrency(invoice.total_amount, invoice.currency), 185, summaryY + 30, { align: 'right' });

  // Payment details (if paid)
  if (invoice.status === 'paid' && invoice.paid_date) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...lightGray);
    const paidY = summaryY + 40;
    doc.text(`PAID ON: ${formatInvoiceDate(invoice.paid_date)}`, 115, paidY);
    if (invoice.payment_method) {
      doc.text(`Payment Method: ${invoice.payment_method.replace('_', ' ').toUpperCase()}`, 115, paidY + 5);
    }
  }

  // Notes section
  if (invoice.notes || invoice.terms) {
    const notesY = summaryY + 55;

    if (invoice.notes) {
      doc.setFontSize(10);
      doc.setTextColor(...darkColor);
      doc.text('Notes:', 20, notesY);
      doc.setFontSize(9);
      doc.setTextColor(...lightGray);
      const noteLines = doc.splitTextToSize(invoice.notes, 170);
      doc.text(noteLines, 20, notesY + 6);
    }

    if (invoice.terms) {
      const termsY = invoice.notes ? notesY + 20 : notesY;
      doc.setFontSize(10);
      doc.setTextColor(...darkColor);
      doc.text('Terms & Conditions:', 20, termsY);
      doc.setFontSize(9);
      doc.setTextColor(...lightGray);
      const termLines = doc.splitTextToSize(invoice.terms, 170);
      doc.text(termLines, 20, termsY + 6);
    }
  }

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(...lightGray);
  doc.text('Thank you for your business!', 105, pageHeight - 20, { align: 'center' });
  doc.text('This is a computer-generated invoice and does not require a signature.', 105, pageHeight - 15, { align: 'center' });
  doc.text('© 2025 Verdict 360. All rights reserved.', 105, pageHeight - 10, { align: 'center' });

  return doc;
}

// Generate and download invoice PDF
export function downloadInvoicePDF(invoice: Invoice): void {
  const doc = generateInvoicePDF(invoice);
  doc.save(`${invoice.invoice_number}.pdf`);
}

// Generate invoice PDF as blob for email attachment
export function getInvoicePDFBlob(invoice: Invoice): Blob {
  const doc = generateInvoicePDF(invoice);
  return doc.output('blob');
}

// Generate invoice PDF as base64 string
export function getInvoicePDFBase64(invoice: Invoice): string {
  const doc = generateInvoicePDF(invoice);
  return doc.output('datauristring');
}