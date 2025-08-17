const express = require('express');
const router = express.Router();
const { authenticateToken, requireTenantAccess } = require('../middleware/auth');
const { addBillingInfo } = require('../middleware/billing');
const { getDatabase } = require('../config/db');
const calendarService = require('../services/calendarService');
const logger = require('../utils/logger');

/**
 * Get tenant dashboard overview
 */
router.get('/overview', authenticateToken, requireTenantAccess, addBillingInfo, async (req, res) => {
  try {
    const { tenantId } = req.user;
    const db = getDatabase();

    // Get current month statistics
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [monthlyStats, totalStats, recentActivity] = await Promise.all([
      // Monthly statistics
      db.raw(`
        SELECT 
          (SELECT COUNT(*) FROM conversations WHERE tenant_id = ? AND created_at >= ?) as monthly_conversations,
          (SELECT COUNT(*) FROM leads WHERE tenant_id = ? AND created_at >= ?) as monthly_leads,
          (SELECT COUNT(*) FROM appointments WHERE tenant_id = ? AND created_at >= ?) as monthly_appointments,
          (SELECT COUNT(*) FROM email_logs WHERE tenant_id = ? AND status = 'sent' AND created_at >= ?) as monthly_emails
      `, [tenantId, startOfMonth, tenantId, startOfMonth, tenantId, startOfMonth, tenantId, startOfMonth]),

      // Total statistics
      db.raw(`
        SELECT 
          (SELECT COUNT(*) FROM conversations WHERE tenant_id = ?) as total_conversations,
          (SELECT COUNT(*) FROM leads WHERE tenant_id = ?) as total_leads,
          (SELECT COUNT(*) FROM appointments WHERE tenant_id = ?) as total_appointments,
          (SELECT COUNT(*) FROM users WHERE tenant_id = ?) as total_users
      `, [tenantId, tenantId, tenantId, tenantId]),

      // Recent activity (last 7 days)
      db.raw(`
        SELECT 
          DATE(created_at) as date,
          COUNT(CASE WHEN 'conversations' = 'conversations' THEN id END) as conversations,
          0 as leads,
          0 as appointments
        FROM conversations 
        WHERE tenant_id = ? AND created_at >= NOW() - INTERVAL '7 days'
        GROUP BY DATE(created_at)
        
        UNION ALL
        
        SELECT 
          DATE(created_at) as date,
          0 as conversations,
          COUNT(id) as leads,
          0 as appointments
        FROM leads 
        WHERE tenant_id = ? AND created_at >= NOW() - INTERVAL '7 days'
        GROUP BY DATE(created_at)
        
        UNION ALL
        
        SELECT 
          DATE(created_at) as date,
          0 as conversations,
          0 as leads,
          COUNT(id) as appointments
        FROM appointments 
        WHERE tenant_id = ? AND created_at >= NOW() - INTERVAL '7 days'
        GROUP BY DATE(created_at)
        
        ORDER BY date DESC
      `, [tenantId, tenantId, tenantId])
    ]);

    // Check calendar connection status
    const calendarConnected = await calendarService.isCalendarConnected(tenantId);

    // Calculate conversion rates
    const monthlyConversations = parseInt(monthlyStats.rows[0].monthly_conversations);
    const monthlyLeads = parseInt(monthlyStats.rows[0].monthly_leads);
    const monthlyAppointments = parseInt(monthlyStats.rows[0].monthly_appointments);

    const conversionRate = monthlyConversations > 0 
      ? Math.round((monthlyLeads / monthlyConversations) * 100) 
      : 0;

    const appointmentRate = monthlyLeads > 0 
      ? Math.round((monthlyAppointments / monthlyLeads) * 100) 
      : 0;

    res.json({
      success: true,
      dashboard: {
        monthly_stats: {
          conversations: monthlyConversations,
          leads: monthlyLeads,
          appointments: monthlyAppointments,
          emails_sent: parseInt(monthlyStats.rows[0].monthly_emails),
          conversion_rate: conversionRate,
          appointment_rate: appointmentRate
        },
        total_stats: {
          conversations: parseInt(totalStats.rows[0].total_conversations),
          leads: parseInt(totalStats.rows[0].total_leads),
          appointments: parseInt(totalStats.rows[0].total_appointments),
          users: parseInt(totalStats.rows[0].total_users)
        },
        integrations: {
          calendar_connected: calendarConnected,
          email_configured: !!process.env.SMTP_HOST,
          billing_active: req.billing?.subscription_status === 'active'
        },
        subscription: {
          status: req.billing?.subscription_status || 'inactive',
          plan: req.billing?.subscription_plan || null,
          trial_ends_at: req.billing?.trial_ends_at
        },
        recent_activity: recentActivity.rows
      }
    });
  } catch (error) {
    logger.error('Error getting dashboard overview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard data'
    });
  }
});

/**
 * Get recent conversations for dashboard
 */
router.get('/conversations/recent', authenticateToken, requireTenantAccess, async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { limit = 10 } = req.query;
    
    const db = getDatabase();
    const conversations = await db('conversations')
      .where('tenant_id', tenantId)
      .select([
        'id',
        'visitor_id', 
        'status',
        'message_count',
        'created_at',
        'updated_at'
      ])
      .orderBy('updated_at', 'desc')
      .limit(parseInt(limit));

    // Get the most recent message for each conversation
    const conversationsWithMessages = await Promise.all(
      conversations.map(async (conversation) => {
        const lastMessage = await db('messages')
          .where('conversation_id', conversation.id)
          .orderBy('created_at', 'desc')
          .select(['content', 'sender_type', 'created_at'])
          .first();

        return {
          ...conversation,
          last_message: lastMessage
        };
      })
    );

    res.json({
      success: true,
      conversations: conversationsWithMessages
    });
  } catch (error) {
    logger.error('Error getting recent conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent conversations'
    });
  }
});

/**
 * Get recent leads for dashboard
 */
router.get('/leads/recent', authenticateToken, requireTenantAccess, async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { limit = 10 } = req.query;
    
    const db = getDatabase();
    const leads = await db('leads')
      .where('tenant_id', tenantId)
      .select([
        'id',
        'first_name',
        'last_name', 
        'email',
        'phone',
        'legal_issue',
        'status',
        'source',
        'created_at'
      ])
      .orderBy('created_at', 'desc')
      .limit(parseInt(limit));

    res.json({
      success: true,
      leads
    });
  } catch (error) {
    logger.error('Error getting recent leads:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent leads'
    });
  }
});

/**
 * Get upcoming appointments for dashboard
 */
router.get('/appointments/upcoming', authenticateToken, requireTenantAccess, async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { limit = 5 } = req.query;
    
    const appointments = await calendarService.getUpcomingAppointments(tenantId, parseInt(limit));

    res.json({
      success: true,
      appointments: appointments.map(appointment => ({
        id: appointment.id,
        client_name: appointment.client_name,
        client_email: appointment.client_email,
        legal_issue: appointment.legal_issue,
        start_time: appointment.start_time,
        status: appointment.status,
        meeting_link: appointment.meeting_link
      }))
    });
  } catch (error) {
    logger.error('Error getting upcoming appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch upcoming appointments'
    });
  }
});

/**
 * Get analytics data for charts
 */
router.get('/analytics', authenticateToken, requireTenantAccess, async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { period = '30' } = req.query; // days
    const db = getDatabase();

    const periodDays = parseInt(period);
    
    const [conversationTrends, leadSources, conversionFunnel, hourlyActivity] = await Promise.all([
      // Conversation trends over time
      db.raw(`
        WITH date_series AS (
          SELECT generate_series(
            CURRENT_DATE - INTERVAL '${periodDays} days',
            CURRENT_DATE,
            '1 day'::interval
          )::date as date
        )
        SELECT 
          ds.date,
          COALESCE(COUNT(c.id), 0) as conversations,
          COALESCE(COUNT(l.id), 0) as leads,
          COALESCE(COUNT(a.id), 0) as appointments
        FROM date_series ds
        LEFT JOIN conversations c ON DATE(c.created_at) = ds.date AND c.tenant_id = ?
        LEFT JOIN leads l ON DATE(l.created_at) = ds.date AND l.tenant_id = ?
        LEFT JOIN appointments a ON DATE(a.created_at) = ds.date AND a.tenant_id = ?
        GROUP BY ds.date
        ORDER BY ds.date
      `, [tenantId, tenantId, tenantId]),

      // Lead sources breakdown
      db('leads')
        .where('tenant_id', tenantId)
        .where('created_at', '>=', db.raw(`NOW() - INTERVAL '${periodDays} days'`))
        .select('source')
        .count('id as count')
        .groupBy('source'),

      // Conversion funnel
      db.raw(`
        SELECT 
          'Visitors' as stage,
          COUNT(DISTINCT visitor_id) as count,
          1 as step_order
        FROM conversations 
        WHERE tenant_id = ? AND created_at >= NOW() - INTERVAL '${periodDays} days'
        
        UNION ALL
        
        SELECT 
          'Conversations' as stage,
          COUNT(*) as count,
          2 as step_order
        FROM conversations 
        WHERE tenant_id = ? AND created_at >= NOW() - INTERVAL '${periodDays} days'
        
        UNION ALL
        
        SELECT 
          'Leads' as stage,
          COUNT(*) as count,
          3 as step_order
        FROM leads 
        WHERE tenant_id = ? AND created_at >= NOW() - INTERVAL '${periodDays} days'
        
        UNION ALL
        
        SELECT 
          'Appointments' as stage,
          COUNT(*) as count,
          4 as step_order
        FROM appointments 
        WHERE tenant_id = ? AND created_at >= NOW() - INTERVAL '${periodDays} days'
        
        ORDER BY step_order
      `, [tenantId, tenantId, tenantId, tenantId]),

      // Hourly activity pattern
      db.raw(`
        SELECT 
          EXTRACT(hour FROM created_at) as hour,
          COUNT(*) as conversations
        FROM conversations 
        WHERE tenant_id = ? AND created_at >= NOW() - INTERVAL '${periodDays} days'
        GROUP BY EXTRACT(hour FROM created_at)
        ORDER BY hour
      `, [tenantId])
    ]);

    res.json({
      success: true,
      analytics: {
        period_days: periodDays,
        conversation_trends: conversationTrends.rows,
        lead_sources: leadSources,
        conversion_funnel: conversionFunnel.rows,
        hourly_activity: hourlyActivity.rows
      }
    });
  } catch (error) {
    logger.error('Error getting analytics data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data'
    });
  }
});

/**
 * Get tenant settings and configuration
 */
router.get('/settings', authenticateToken, requireTenantAccess, async (req, res) => {
  try {
    const { tenantId } = req.user;
    const db = getDatabase();
    
    const tenant = await db('tenants')
      .where('id', tenantId)
      .select(['name', 'subdomain', 'branding', 'settings'])
      .first();

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    // Parse JSON fields
    const branding = typeof tenant.branding === 'string' 
      ? JSON.parse(tenant.branding) 
      : tenant.branding || {};
    
    const settings = typeof tenant.settings === 'string' 
      ? JSON.parse(tenant.settings) 
      : tenant.settings || {};

    // Check integration statuses
    const integrations = {
      calendar: await calendarService.isCalendarConnected(tenantId),
      email: !!process.env.SMTP_HOST,
      billing: !!process.env.STRIPE_SECRET_KEY
    };

    res.json({
      success: true,
      tenant: {
        name: tenant.name,
        subdomain: tenant.subdomain,
        branding,
        settings,
        integrations
      }
    });
  } catch (error) {
    logger.error('Error getting tenant settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tenant settings'
    });
  }
});

/**
 * Update tenant settings
 */
router.patch('/settings', authenticateToken, requireTenantAccess, async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { name, branding, settings } = req.body;
    
    const db = getDatabase();
    const updates = {};
    
    if (name) updates.name = name;
    if (branding) updates.branding = JSON.stringify(branding);
    if (settings) updates.settings = JSON.stringify(settings);
    updates.updated_at = db.fn.now();

    await db('tenants').where('id', tenantId).update(updates);

    logger.info(`Tenant ${tenantId} settings updated`);

    res.json({
      success: true,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    logger.error('Error updating tenant settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings'
    });
  }
});

/**
 * Get widget configuration for embedding
 */
router.get('/widget/config', authenticateToken, requireTenantAccess, async (req, res) => {
  try {
    const { tenantId } = req.user;
    const db = getDatabase();
    
    const tenant = await db('tenants')
      .where('id', tenantId)
      .select(['subdomain', 'branding'])
      .first();

    const branding = typeof tenant.branding === 'string' 
      ? JSON.parse(tenant.branding) 
      : tenant.branding || {};

    const widgetConfig = {
      tenant_subdomain: tenant.subdomain,
      widget_url: `https://${tenant.subdomain}.verdict360.com/widget`,
      embed_code: `<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://${tenant.subdomain}.verdict360.com/widget.js';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>`,
      customization: {
        primary_color: branding.primaryColor || '#2563eb',
        company_name: branding.companyName || tenant.name,
        welcome_message: branding.welcomeMessage || `Hello! How can ${branding.companyName || 'we'} help you today?`
      }
    };

    res.json({
      success: true,
      widget: widgetConfig
    });
  } catch (error) {
    logger.error('Error getting widget config:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch widget configuration'
    });
  }
});

module.exports = router;