// @ts-nocheck
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/config/database';
import { fail } from '@sveltejs/kit';

export const load = async ({ parent, url }: Parameters<PageServerLoad>[0]) => {
  const { tenantId } = await parent();

  const page = Number(url.searchParams.get('page')) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;
  const search = url.searchParams.get('search') || '';
  const status = url.searchParams.get('status') || 'all';

  try {
    // Build query
    let query = db('chat_leads').where('tenant_id', tenantId);

    if (search) {
      query = query.where(function() {
        this.where('name', 'ilike', `%${search}%`)
          .orWhere('email', 'ilike', `%${search}%`)
          .orWhere('phone', 'ilike', `%${search}%`)
          .orWhere('enquiry_details', 'ilike', `%${search}%`);
      });
    }

    if (status !== 'all') {
      query = query.where('status', status);
    }

    // Get total count
    const [{ count }] = await query.clone().count('* as count');

    // Get leads with pagination
    const leads = await query
      .select('*')
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    // Get statistics
    const stats = await db('chat_leads')
      .where('tenant_id', tenantId)
      .select(
        db.raw('COUNT(*) as total'),
        db.raw("COUNT(CASE WHEN status = 'new' THEN 1 END) as new"),
        db.raw("COUNT(CASE WHEN status = 'contacted' THEN 1 END) as contacted"),
        db.raw("COUNT(CASE WHEN status = 'qualified' THEN 1 END) as qualified"),
        db.raw("COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted")
      )
      .first();

    return {
      leads,
      pagination: {
        page,
        limit,
        total: Number(count),
        totalPages: Math.ceil(Number(count) / limit)
      },
      filters: {
        search,
        status
      },
      stats
    };
  } catch (error) {
    console.error('Error loading leads:', error);
    return {
      leads: [],
      pagination: {
        page: 1,
        limit,
        total: 0,
        totalPages: 0
      },
      filters: {
        search: '',
        status: 'all'
      },
      stats: {
        total: 0,
        new: 0,
        contacted: 0,
        qualified: 0,
        converted: 0
      }
    };
  }
};

export const actions = {
  updateStatus: async ({ request, locals }: import('./$types').RequestEvent) => {
    const data = await request.formData();
    const leadId = data.get('leadId') as string;
    const status = data.get('status') as string;

    if (!leadId || !status) {
      return fail(400, { error: 'Missing required fields' });
    }

    try {
      await db('chat_leads')
        .where('id', leadId)
        .where('tenant_id', locals.tenantId)
        .update({
          status,
          updated_at: new Date()
        });

      return { success: true };
    } catch (error) {
      console.error('Error updating lead status:', error);
      return fail(500, { error: 'Failed to update lead status' });
    }
  },

  updateAssignment: async ({ request, locals }: import('./$types').RequestEvent) => {
    const data = await request.formData();
    const leadId = data.get('leadId') as string;
    const assignedTo = data.get('assignedTo') as string;

    if (!leadId) {
      return fail(400, { error: 'Missing lead ID' });
    }

    try {
      await db('chat_leads')
        .where('id', leadId)
        .where('tenant_id', locals.tenantId)
        .update({
          assigned_to: assignedTo || null,
          updated_at: new Date()
        });

      return { success: true };
    } catch (error) {
      console.error('Error updating lead assignment:', error);
      return fail(500, { error: 'Failed to update lead assignment' });
    }
  },

  addNote: async ({ request, locals }: import('./$types').RequestEvent) => {
    const data = await request.formData();
    const leadId = data.get('leadId') as string;
    const note = data.get('note') as string;

    if (!leadId || !note) {
      return fail(400, { error: 'Missing required fields' });
    }

    try {
      const lead = await db('chat_leads')
        .where('id', leadId)
        .where('tenant_id', locals.tenantId)
        .first();

      if (!lead) {
        return fail(404, { error: 'Lead not found' });
      }

      const currentNotes = lead.internal_notes || '';
      const newNote = `[${new Date().toISOString()}] ${note}`;
      const updatedNotes = currentNotes ? `${currentNotes}\n${newNote}` : newNote;

      await db('chat_leads')
        .where('id', leadId)
        .update({
          internal_notes: updatedNotes,
          updated_at: new Date()
        });

      return { success: true };
    } catch (error) {
      console.error('Error adding note:', error);
      return fail(500, { error: 'Failed to add note' });
    }
  },

  deleteLead: async ({ request, locals }: import('./$types').RequestEvent) => {
    const data = await request.formData();
    const leadId = data.get('leadId') as string;

    if (!leadId) {
      return fail(400, { error: 'Missing lead ID' });
    }

    try {
      await db('chat_leads')
        .where('id', leadId)
        .where('tenant_id', locals.tenantId)
        .delete();

      return { success: true };
    } catch (error) {
      console.error('Error deleting lead:', error);
      return fail(500, { error: 'Failed to delete lead' });
    }
  }
};;null as any as Actions;