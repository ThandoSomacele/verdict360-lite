const express = require('express');
const { query, validationResult } = require('express-validator');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { getDatabase } = require('../config/db');

const router = express.Router();

// Get dashboard analytics
router.get('/dashboard',
  authenticateToken,
  requireRole(['admin', 'attorney']),
  [
    query('period').optional().isIn(['7d', '30d', '90d', '1y']),
    query('timezone').optional().trim()
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { period = '30d' } = req.query;
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
      case '1y':
        dateFilter = db.raw("created_at >= NOW() - INTERVAL '1 year'");
        break;
      default:
        dateFilter = db.raw("created_at >= NOW() - INTERVAL '30 days'");
    }

    // Get overview metrics
    const [leadsCount, conversationsCount, messagesCount] = await Promise.all([
      db('leads').where({ tenant_id: req.tenant.id }).where(dateFilter).count('* as count').first(),
      db('conversations').where({ tenant_id: req.tenant.id }).where(dateFilter).count('* as count').first(),
      db('messages')
        .join('conversations', 'messages.conversation_id', 'conversations.id')
        .where({ 'conversations.tenant_id': req.tenant.id })
        .where(db.raw("messages.created_at >= NOW() - INTERVAL ?", [period.replace('d', ' days').replace('y', ' year')]))
        .count('* as count').first()
    ]);

    // Get conversion metrics
    const conversionMetrics = await db('leads')
      .where({ tenant_id: req.tenant.id })
      .where(dateFilter)
      .select(
        db.raw('COUNT(*) as total'),
        db.raw('COUNT(*) FILTER (WHERE status = ?) as converted', ['converted']),
        db.raw('COUNT(*) FILTER (WHERE consultation_scheduled_at IS NOT NULL) as scheduled')
      )
      .first();

    // Get lead status distribution
    const leadStatusDistribution = await db('leads')
      .where({ tenant_id: req.tenant.id })
      .where(dateFilter)
      .select('status')
      .count('* as count')
      .groupBy('status');

    // Get daily trends
    const dailyTrends = await db('leads')
      .where({ tenant_id: req.tenant.id })
      .where(dateFilter)
      .select(
        db.raw('DATE(created_at) as date'),
        db.raw('COUNT(*) as leads'),
        db.raw('COUNT(*) FILTER (WHERE status = ?) as conversions', ['converted'])
      )
      .groupBy(db.raw('DATE(created_at)'))
      .orderBy('date');

    // Get top legal issues
    const topLegalIssues = await db('leads')
      .where({ tenant_id: req.tenant.id })
      .where(dateFilter)
      .whereNotNull('legal_issue')
      .select('legal_issue')
      .count('* as count')
      .groupBy('legal_issue')
      .orderBy('count', 'desc')
      .limit(10);

    // Calculate rates
    const totalLeads = parseInt(conversionMetrics.total) || 0;
    const convertedLeads = parseInt(conversionMetrics.converted) || 0;
    const scheduledLeads = parseInt(conversionMetrics.scheduled) || 0;

    res.json({
      period,
      overview: {
        totalLeads: parseInt(leadsCount.count) || 0,
        totalConversations: parseInt(conversationsCount.count) || 0,
        totalMessages: parseInt(messagesCount.count) || 0,
        conversionRate: totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(2) : 0,
        consultationRate: totalLeads > 0 ? ((scheduledLeads / totalLeads) * 100).toFixed(2) : 0
      },
      leadMetrics: {
        total: totalLeads,
        converted: convertedLeads,
        scheduled: scheduledLeads,
        conversionRate: totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(2) : 0
      },
      statusDistribution: leadStatusDistribution.map(item => ({
        status: item.status,
        count: parseInt(item.count),
        percentage: totalLeads > 0 ? ((parseInt(item.count) / totalLeads) * 100).toFixed(1) : 0
      })),
      dailyTrends: dailyTrends.map(item => ({
        date: item.date,
        leads: parseInt(item.leads),
        conversions: parseInt(item.conversions),
        conversionRate: parseInt(item.leads) > 0 ? 
          ((parseInt(item.conversions) / parseInt(item.leads)) * 100).toFixed(1) : 0
      })),
      topLegalIssues: topLegalIssues.map(item => ({
        issue: item.legal_issue,
        count: parseInt(item.count),
        percentage: totalLeads > 0 ? ((parseInt(item.count) / totalLeads) * 100).toFixed(1) : 0
      }))
    });
  })
);

// Get conversation analytics
router.get('/conversations',
  authenticateToken,
  requireRole(['admin', 'attorney']),
  [query('period').optional().isIn(['7d', '30d', '90d'])],
  asyncHandler(async (req, res) => {
    const { period = '30d' } = req.query;
    const db = getDatabase();

    let dateFilter;
    switch (period) {
      case '7d':
        dateFilter = db.raw("started_at >= NOW() - INTERVAL '7 days'");
        break;
      case '30d':
        dateFilter = db.raw("started_at >= NOW() - INTERVAL '30 days'");
        break;
      case '90d':
        dateFilter = db.raw("started_at >= NOW() - INTERVAL '90 days'");
        break;
      default:
        dateFilter = db.raw("started_at >= NOW() - INTERVAL '30 days'");
    }

    // Get conversation metrics
    const conversationMetrics = await db('conversations')
      .where({ tenant_id: req.tenant.id })
      .where(dateFilter)
      .select(
        db.raw('COUNT(*) as total'),
        db.raw('COUNT(*) FILTER (WHERE status = ?) as completed', ['completed']),
        db.raw('COUNT(*) FILTER (WHERE status = ?) as abandoned', ['abandoned']),
        db.raw('AVG(message_count) as avg_messages'),
        db.raw('AVG(EXTRACT(EPOCH FROM (ended_at - started_at))/60) as avg_duration_minutes')
      )
      .first();

    // Get hourly distribution
    const hourlyDistribution = await db('conversations')
      .where({ tenant_id: req.tenant.id })
      .where(dateFilter)
      .select(
        db.raw('EXTRACT(HOUR FROM started_at) as hour'),
        db.raw('COUNT(*) as count')
      )
      .groupBy(db.raw('EXTRACT(HOUR FROM started_at)'))
      .orderBy('hour');

    // Get daily conversation trends
    const dailyTrends = await db('conversations')
      .where({ tenant_id: req.tenant.id })
      .where(dateFilter)
      .select(
        db.raw('DATE(started_at) as date'),
        db.raw('COUNT(*) as total'),
        db.raw('COUNT(*) FILTER (WHERE status = ?) as completed', ['completed']),
        db.raw('AVG(message_count) as avg_messages')
      )
      .groupBy(db.raw('DATE(started_at)'))
      .orderBy('date');

    const total = parseInt(conversationMetrics.total) || 0;
    const completed = parseInt(conversationMetrics.completed) || 0;
    const abandoned = parseInt(conversationMetrics.abandoned) || 0;

    res.json({
      period,
      overview: {
        total,
        completed,
        abandoned,
        completionRate: total > 0 ? ((completed / total) * 100).toFixed(2) : 0,
        averageMessages: parseFloat(conversationMetrics.avg_messages) || 0,
        averageDurationMinutes: parseFloat(conversationMetrics.avg_duration_minutes) || 0
      },
      hourlyDistribution: hourlyDistribution.map(item => ({
        hour: parseInt(item.hour),
        count: parseInt(item.count)
      })),
      dailyTrends: dailyTrends.map(item => ({
        date: item.date,
        total: parseInt(item.total),
        completed: parseInt(item.completed),
        averageMessages: parseFloat(item.avg_messages) || 0,
        completionRate: parseInt(item.total) > 0 ? 
          ((parseInt(item.completed) / parseInt(item.total)) * 100).toFixed(1) : 0
      }))
    });
  })
);

// Get attorney performance
router.get('/attorneys',
  authenticateToken,
  requireRole(['admin']),
  [query('period').optional().isIn(['7d', '30d', '90d'])],
  asyncHandler(async (req, res) => {
    const { period = '30d' } = req.query;
    const db = getDatabase();

    let dateFilter;
    switch (period) {
      case '7d':
        dateFilter = db.raw("leads.created_at >= NOW() - INTERVAL '7 days'");
        break;
      case '30d':
        dateFilter = db.raw("leads.created_at >= NOW() - INTERVAL '30 days'");
        break;
      case '90d':
        dateFilter = db.raw("leads.created_at >= NOW() - INTERVAL '90 days'");
        break;
      default:
        dateFilter = db.raw("leads.created_at >= NOW() - INTERVAL '30 days'");
    }

    const attorneyPerformance = await db('users')
      .where({ 'users.tenant_id': req.tenant.id, 'users.role': 'attorney' })
      .leftJoin('leads', 'users.id', 'leads.assigned_attorney_id')
      .where(function() {
        this.whereNull('leads.id').orWhere(dateFilter);
      })
      .select(
        'users.id',
        'users.first_name',
        'users.last_name',
        'users.email',
        db.raw('COUNT(leads.id) as assigned_leads'),
        db.raw('COUNT(*) FILTER (WHERE leads.status = ?) as converted_leads', ['converted']),
        db.raw('COUNT(*) FILTER (WHERE leads.consultation_scheduled_at IS NOT NULL) as scheduled_consultations')
      )
      .groupBy('users.id', 'users.first_name', 'users.last_name', 'users.email')
      .orderBy('assigned_leads', 'desc');

    res.json({
      period,
      attorneys: attorneyPerformance.map(attorney => {
        const assignedLeads = parseInt(attorney.assigned_leads) || 0;
        const convertedLeads = parseInt(attorney.converted_leads) || 0;
        const scheduledConsultations = parseInt(attorney.scheduled_consultations) || 0;

        return {
          id: attorney.id,
          firstName: attorney.first_name,
          lastName: attorney.last_name,
          email: attorney.email,
          assignedLeads,
          convertedLeads,
          scheduledConsultations,
          conversionRate: assignedLeads > 0 ? ((convertedLeads / assignedLeads) * 100).toFixed(2) : 0,
          consultationRate: assignedLeads > 0 ? ((scheduledConsultations / assignedLeads) * 100).toFixed(2) : 0
        };
      })
    });
  })
);

module.exports = router;