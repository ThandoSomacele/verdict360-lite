import nodemailer from 'nodemailer';
import type { ContactFormData } from '$lib/components/ContactForm.svelte';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface ChatLead {
  id: string;
  tenant_id: string;
  name: string;
  email: string;
  phone: string;
  enquiry_details: string;
  additional_message?: string;
  preferred_contact: 'email' | 'phone';
  conversation_history?: any;
  created_at: Date;
}

export class EmailService {
  private transporter: nodemailer.Transporter;
  private fromEmail: string;
  private fromName: string;

  constructor() {
    const config: EmailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
      }
    };

    this.fromEmail = process.env.FROM_EMAIL || 'noreply@verdict360.com';
    this.fromName = process.env.FROM_NAME || 'Verdict 360';

    this.transporter = nodemailer.createTransport(config);
  }

  /**
   * Send email notification to law firm about new chat lead
   */
  async sendLeadNotificationToFirm(lead: ChatLead, firmEmails: string[]): Promise<void> {
    const subject = `New Legal Enquiry from ${lead.name}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1e40af; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #374151; }
          .value { color: #111827; margin-top: 5px; }
          .enquiry-box { background: white; padding: 15px; border-radius: 8px; margin-top: 10px; }
          .cta { background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
          .urgent { background: #fef2f2; border-left: 4px solid #ef4444; padding: 10px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0;">New Chat Lead Received</h2>
            <p style="margin: 5px 0 0 0;">Via Verdict 360 AI Legal Assistant</p>
          </div>

          <div class="content">
            ${this.isUrgentMatter(lead.enquiry_details) ? `
            <div class="urgent">
              <strong>⚠️ Urgent Matter Detected</strong>
              <p style="margin: 5px 0 0 0;">This enquiry appears to be time-sensitive and may require immediate attention.</p>
            </div>
            ` : ''}

            <div class="field">
              <div class="label">Contact Details:</div>
              <div class="value">
                <strong>${lead.name}</strong><br>
                📧 ${lead.email}<br>
                📱 ${lead.phone}<br>
                Prefers contact via: <strong>${lead.preferred_contact === 'phone' ? 'Phone' : 'Email'}</strong>
              </div>
            </div>

            <div class="field">
              <div class="label">Legal Matter:</div>
              <div class="enquiry-box">
                ${lead.enquiry_details.replace(/\n/g, '<br>')}
              </div>
            </div>

            ${lead.additional_message ? `
            <div class="field">
              <div class="label">Additional Notes:</div>
              <div class="value">${lead.additional_message.replace(/\n/g, '<br>')}</div>
            </div>
            ` : ''}

            <div class="field">
              <div class="label">Submitted:</div>
              <div class="value">${new Date(lead.created_at).toLocaleString('en-ZA', {
                timeZone: 'Africa/Johannesburg',
                dateStyle: 'full',
                timeStyle: 'short'
              })}</div>
            </div>

            <a href="${process.env.APP_URL || 'http://localhost:3000'}/admin/leads/${lead.id}" class="cta">
              View Full Details in Dashboard
            </a>
          </div>

          <div class="footer">
            <p>This is an automated notification from your Verdict 360 AI Legal Assistant.</p>
            <p>Lead ID: ${lead.id}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"${this.fromName}" <${this.fromEmail}>`,
      to: firmEmails.join(', '),
      subject,
      html
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Lead notification sent to ${firmEmails.join(', ')}`);
    } catch (error) {
      console.error('Error sending lead notification email:', error);
      throw error;
    }
  }

  /**
   * Send confirmation email to the person who submitted the form
   */
  async sendLeadConfirmationToUser(lead: ChatLead, firmName: string = 'Demo Law Firm'): Promise<void> {
    const subject = `We've received your enquiry - ${firmName}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1e40af; color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .message { background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .next-steps { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0;">${firmName}</h2>
            <p style="margin: 10px 0 0 0;">Thank you for contacting us</p>
          </div>

          <div class="content">
            <p>Dear ${lead.name},</p>

            <p>Thank you for reaching out to us through our online legal assistant. We have received your enquiry and one of our attorneys will review it shortly.</p>

            <div class="message">
              <strong>Your Enquiry:</strong><br>
              ${lead.enquiry_details.replace(/\n/g, '<br>')}
            </div>

            <div class="next-steps">
              <h3 style="margin-top: 0;">What happens next?</h3>
              <ul>
                <li>An attorney will review your enquiry within 24 hours</li>
                <li>We'll contact you via ${lead.preferred_contact === 'phone' ? 'phone' : 'email'} to discuss your matter</li>
                <li>If urgent, we'll prioritize your case accordingly</li>
              </ul>
            </div>

            <p><strong>Your Reference Number:</strong> ${lead.id.substring(0, 8).toUpperCase()}</p>

            <p>If you need immediate assistance or have additional information to provide, please don't hesitate to contact us directly.</p>

            <p>Kind regards,<br>
            <strong>The ${firmName} Team</strong></p>
          </div>

          <div class="footer">
            <p>This email confirms receipt of your online enquiry submitted on ${new Date(lead.created_at).toLocaleDateString('en-ZA')}.</p>
            <p>© ${new Date().getFullYear()} ${firmName}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"${firmName}" <${this.fromEmail}>`,
      to: lead.email,
      subject,
      html
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Confirmation email sent to ${lead.email}`);
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      // Don't throw error for user confirmation - it's not critical
    }
  }

  /**
   * Check if the enquiry appears to be urgent
   */
  private isUrgentMatter(enquiry: string): boolean {
    const urgentKeywords = [
      'urgent', 'emergency', 'arrested', 'court date', 'deadline',
      'eviction', 'accident', 'injured', 'death', 'police',
      'tomorrow', 'today', 'immediately', 'asap'
    ];

    const lowerEnquiry = enquiry.toLowerCase();
    return urgentKeywords.some(keyword => lowerEnquiry.includes(keyword));
  }

  /**
   * Test email configuration
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email service is configured correctly');
      return true;
    } catch (error) {
      console.error('Email service configuration error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();