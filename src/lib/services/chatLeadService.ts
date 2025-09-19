import knex from 'knex';
import knexConfig from '../../../knexfile.js';
import type { ContactFormData } from '$lib/components/ContactForm.svelte';
import type { ChatMessage } from '$lib/types';
import { emailService } from './emailService';

const db = knex(knexConfig[process.env.NODE_ENV || 'development']);

export interface ChatLead {
  id?: string;
  tenant_id: string;
  name: string;
  email: string;
  phone: string;
  enquiry_details: string;
  additional_message?: string;
  preferred_contact: 'email' | 'phone';
  conversation_history?: any;
  status?: string;
  source?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  branding?: {
    companyName: string;
    primaryColor?: string;
    logoUrl?: string;
  };
  contact_emails: string[];
  settings?: any;
  subscription_status: string;
}

export class ChatLeadService {
  /**
   * Save a new chat lead to the database
   */
  async createChatLead(
    contactData: ContactFormData,
    tenantId: string,
    conversationHistory?: ChatMessage[]
  ): Promise<ChatLead> {
    try {
      const lead: Omit<ChatLead, 'id'> = {
        tenant_id: tenantId,
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        enquiry_details: contactData.enquiryDetails,
        additional_message: contactData.message,
        preferred_contact: contactData.preferredContact,
        conversation_history: JSON.stringify(conversationHistory || []),
        status: 'new',
        source: 'chat_widget'
      };

      // Insert into database
      const [insertedLead] = await db('chat_leads')
        .insert(lead)
        .returning('*');

      console.log('Chat lead saved:', insertedLead.id);

      // Get tenant information
      const tenant = await this.getTenant(tenantId);

      // Send email notifications
      await this.sendNotifications(insertedLead, tenant);

      return insertedLead;
    } catch (error) {
      console.error('Error creating chat lead:', error);
      throw error;
    }
  }

  /**
   * Get tenant information
   */
  async getTenant(tenantId: string): Promise<Tenant> {
    const tenant = await db('tenants')
      .where('id', tenantId)
      .first();

    if (!tenant) {
      throw new Error(`Tenant not found: ${tenantId}`);
    }

    return tenant;
  }

  /**
   * Send email notifications for new lead
   */
  private async sendNotifications(lead: ChatLead, tenant: Tenant): Promise<void> {
    try {
      // Get firm contact emails
      const firmEmails = tenant.contact_emails || ['admin@verdict360.com'];
      const firmName = tenant.branding?.companyName || tenant.name;

      // Send notification to law firm
      await emailService.sendLeadNotificationToFirm(lead as any, firmEmails);

      // Send confirmation to user
      await emailService.sendLeadConfirmationToUser(lead as any, firmName);

      // Update lead status to indicate emails were sent
      await db('chat_leads')
        .where('id', lead.id)
        .update({
          status: 'notified',
          updated_at: new Date()
        });

    } catch (error) {
      console.error('Error sending notifications:', error);
      // Don't throw - we still want to save the lead even if emails fail
    }
  }

  /**
   * Get all leads for a tenant
   */
  async getLeadsForTenant(tenantId: string, status?: string): Promise<ChatLead[]> {
    let query = db('chat_leads')
      .where('tenant_id', tenantId)
      .orderBy('created_at', 'desc');

    if (status) {
      query = query.where('status', status);
    }

    return await query;
  }

  /**
   * Update lead status
   */
  async updateLeadStatus(leadId: string, status: string, notes?: string): Promise<void> {
    const updateData: any = {
      status,
      updated_at: new Date()
    };

    if (notes) {
      updateData.internal_notes = notes;
    }

    if (status === 'contacted') {
      updateData.contacted_at = new Date();
    }

    await db('chat_leads')
      .where('id', leadId)
      .update(updateData);
  }

  /**
   * Assign lead to a staff member
   */
  async assignLead(leadId: string, userId: string): Promise<void> {
    await db('chat_leads')
      .where('id', leadId)
      .update({
        assigned_to: userId,
        updated_at: new Date()
      });
  }

  /**
   * Get lead statistics for a tenant
   */
  async getLeadStats(tenantId: string): Promise<any> {
    const stats = await db('chat_leads')
      .where('tenant_id', tenantId)
      .select(
        db.raw('COUNT(*) as total'),
        db.raw("COUNT(CASE WHEN status = 'new' THEN 1 END) as new"),
        db.raw("COUNT(CASE WHEN status = 'contacted' THEN 1 END) as contacted"),
        db.raw("COUNT(CASE WHEN status = 'qualified' THEN 1 END) as qualified"),
        db.raw("COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted"),
        db.raw("COUNT(CASE WHEN created_at >= NOW() - INTERVAL '24 HOURS' THEN 1 END) as last_24_hours"),
        db.raw("COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 DAYS' THEN 1 END) as last_7_days")
      )
      .first();

    return stats;
  }
}

// Export singleton instance
export const chatLeadService = new ChatLeadService();