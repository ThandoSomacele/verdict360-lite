const { getDatabase } = require('../config/db');
const logger = require('../utils/logger');

class Lead {
  static async findById(id) {
    const db = getDatabase();
    return db('leads')
      .where({ id })
      .leftJoin('users', 'leads.assigned_attorney_id', 'users.id')
      .select([
        'leads.*',
        'users.first_name as attorney_first_name',
        'users.last_name as attorney_last_name',
        'users.email as attorney_email'
      ])
      .first();
  }

  static async findByEmail(email, tenantId) {
    const db = getDatabase();
    return db('leads')
      .where({ email, tenant_id: tenantId })
      .where('status', '!=', 'closed')
      .first();
  }

  static async create(leadData) {
    const db = getDatabase();
    const {
      tenantId,
      firstName,
      lastName,
      email,
      phone,
      legalIssue,
      consultationDetails,
      metadata = {}
    } = leadData;

    // Check for existing lead with same email
    const existingLead = await this.findByEmail(email, tenantId);
    if (existingLead) {
      throw new Error('Lead already exists');
    }

    const [lead] = await db('leads')
      .insert({
        tenant_id: tenantId,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        legal_issue: legalIssue,
        consultation_details: consultationDetails ? JSON.stringify(consultationDetails) : null,
        metadata: JSON.stringify(metadata),
        status: 'new',
        priority: 'medium'
      })
      .returning('*');

    logger.info(`Lead created: ${email} for tenant ${tenantId}`);
    return lead;
  }

  static async update(id, updateData) {
    const db = getDatabase();
    const lead = await this.findById(id);
    
    if (!lead) {
      throw new Error('Lead not found');
    }

    const allowedFields = [
      'status', 'priority', 'assigned_attorney_id', 'consultation_scheduled_at',
      'notes', 'consultation_details', 'metadata'
    ];

    const filteredData = {};
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        if (key === 'consultation_details' || key === 'metadata') {
          filteredData[key] = JSON.stringify(updateData[key]);
        } else {
          filteredData[key] = updateData[key];
        }
      }
    });

    if (Object.keys(filteredData).length === 0) {
      throw new Error('No valid fields to update');
    }

    filteredData.updated_at = db.fn.now();

    const [updatedLead] = await db('leads')
      .where({ id })
      .update(filteredData)
      .returning('*');

    logger.info(`Lead updated: ${lead.email} - ${lead.id}`);
    return updatedLead;
  }

  static async assignAttorney(id, attorneyId, tenantId) {
    const db = getDatabase();
    
    // Verify attorney belongs to tenant
    const attorney = await db('users')
      .where({ id: attorneyId, tenant_id: tenantId, role: 'attorney' })
      .first();
    
    if (!attorney) {
      throw new Error('Invalid attorney assignment');
    }

    const [updatedLead] = await db('leads')
      .where({ id })
      .update({
        assigned_attorney_id: attorneyId,
        updated_at: db.fn.now()
      })
      .returning('*');

    logger.info(`Lead ${id} assigned to attorney ${attorneyId}`);
    return updatedLead;
  }

  static async scheduleConsultation(id, consultationData) {
    const db = getDatabase();
    const { scheduledAt, details } = consultationData;

    const [updatedLead] = await db('leads')
      .where({ id })
      .update({
        consultation_scheduled_at: scheduledAt,
        consultation_details: details ? JSON.stringify(details) : null,
        status: 'scheduled',
        updated_at: db.fn.now()
      })
      .returning('*');

    logger.info(`Consultation scheduled for lead ${id} at ${scheduledAt}`);
    return updatedLead;
  }

  static async getByTenant(tenantId, filters = {}) {
    const db = getDatabase();
    let query = db('leads')
      .where({ 'leads.tenant_id': tenantId })
      .leftJoin('users', 'leads.assigned_attorney_id', 'users.id')
      .select([
        'leads.*',
        'users.first_name as attorney_first_name',
        'users.last_name as attorney_last_name',
        'users.email as attorney_email'
      ]);

    // Apply filters
    if (filters.status) {
      query = query.where('leads.status', filters.status);
    }

    if (filters.priority) {
      query = query.where('leads.priority', filters.priority);
    }

    if (filters.assignedTo) {
      query = query.where('leads.assigned_attorney_id', filters.assignedTo);
    }

    if (filters.search) {
      query = query.where(function() {
        this.where('leads.first_name', 'ilike', `%${filters.search}%`)
          .orWhere('leads.last_name', 'ilike', `%${filters.search}%`)
          .orWhere('leads.email', 'ilike', `%${filters.search}%`)
          .orWhere('leads.legal_issue', 'ilike', `%${filters.search}%`);
      });
    }

    if (filters.dateFrom) {
      query = query.where('leads.created_at', '>=', filters.dateFrom);
    }

    if (filters.dateTo) {
      query = query.where('leads.created_at', '<=', filters.dateTo);
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    const [leads, totalCount] = await Promise.all([
      query.clone()
        .orderBy('leads.created_at', 'desc')
        .limit(limit)
        .offset(offset),
      query.clone().count('leads.id as count').first()
    ]);

    return {
      leads,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(totalCount.count),
        pages: Math.ceil(parseInt(totalCount.count) / limit)
      }
    };
  }

  static async getTenantStats(tenantId, period = '30d') {
    const db = getDatabase();

    let dateFilter;
    switch (period) {
      case '7d':
        dateFilter = db.raw("created_at >= NOW() - INTERVAL '7 days'");
        break;
      case '30d':
        dateFilter = db.raw("created_at >= NOW() - INTERVAL '30 days'");
        break;
      case '90d':
        dateFilter = db.raw("created_at >= NOW() - INTERVAL '90 days'");
        break;
      default:
        dateFilter = db.raw("created_at >= NOW() - INTERVAL '30 days'");
    }

    const stats = await db('leads')
      .where({ tenant_id: tenantId })
      .where(dateFilter)
      .select(
        db.raw('COUNT(*) as total'),
        db.raw('COUNT(*) FILTER (WHERE status = ?) as new_leads', ['new']),
        db.raw('COUNT(*) FILTER (WHERE status = ?) as contacted', ['contacted']),
        db.raw('COUNT(*) FILTER (WHERE status = ?) as scheduled', ['scheduled']),
        db.raw('COUNT(*) FILTER (WHERE status = ?) as converted', ['converted']),
        db.raw('COUNT(*) FILTER (WHERE status = ?) as closed', ['closed']),
        db.raw('COUNT(*) FILTER (WHERE priority = ?) as high_priority', ['high']),
        db.raw('COUNT(*) FILTER (WHERE assigned_attorney_id IS NOT NULL) as assigned')
      )
      .first();

    const total = parseInt(stats.total) || 0;
    const converted = parseInt(stats.converted) || 0;
    const scheduled = parseInt(stats.scheduled) || 0;

    return {
      total,
      newLeads: parseInt(stats.new_leads) || 0,
      contacted: parseInt(stats.contacted) || 0,
      scheduled,
      converted,
      closed: parseInt(stats.closed) || 0,
      highPriority: parseInt(stats.high_priority) || 0,
      assigned: parseInt(stats.assigned) || 0,
      conversionRate: total > 0 ? ((converted / total) * 100).toFixed(2) : 0,
      consultationRate: total > 0 ? ((scheduled / total) * 100).toFixed(2) : 0
    };
  }

  static async getDailyStats(tenantId, days = 30) {
    const db = getDatabase();

    const dailyStats = await db('leads')
      .where({ tenant_id: tenantId })
      .where(db.raw('created_at >= NOW() - INTERVAL ? DAY', [days]))
      .select(
        db.raw('DATE(created_at) as date'),
        db.raw('COUNT(*) as total'),
        db.raw('COUNT(*) FILTER (WHERE status = ?) as converted', ['converted'])
      )
      .groupBy(db.raw('DATE(created_at)'))
      .orderBy('date');

    return dailyStats.map(stat => ({
      date: stat.date,
      total: parseInt(stat.total),
      converted: parseInt(stat.converted),
      conversionRate: parseInt(stat.total) > 0 ? 
        ((parseInt(stat.converted) / parseInt(stat.total)) * 100).toFixed(1) : 0
    }));
  }

  static async getTopLegalIssues(tenantId, limit = 10) {
    const db = getDatabase();

    const issues = await db('leads')
      .where({ tenant_id: tenantId })
      .whereNotNull('legal_issue')
      .where('legal_issue', '!=', '')
      .select('legal_issue')
      .count('* as count')
      .groupBy('legal_issue')
      .orderBy('count', 'desc')
      .limit(limit);

    const total = await db('leads')
      .where({ tenant_id: tenantId })
      .whereNotNull('legal_issue')
      .where('legal_issue', '!=', '')
      .count('* as count')
      .first();

    const totalCount = parseInt(total.count) || 0;

    return issues.map(issue => ({
      issue: issue.legal_issue,
      count: parseInt(issue.count),
      percentage: totalCount > 0 ? ((parseInt(issue.count) / totalCount) * 100).toFixed(1) : 0
    }));
  }

  static async delete(id) {
    const db = getDatabase();
    const lead = await this.findById(id);
    
    if (!lead) {
      throw new Error('Lead not found');
    }

    // Soft delete by updating status
    const [deletedLead] = await db('leads')
      .where({ id })
      .update({
        status: 'closed',
        updated_at: db.fn.now()
      })
      .returning(['id', 'email', 'status']);

    logger.info(`Lead closed: ${lead.email} - ${id}`);
    return deletedLead;
  }
}

module.exports = Lead;