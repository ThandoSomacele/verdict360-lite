const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const { getDatabase } = require('../config/db');
const logger = require('../utils/logger');
const bcrypt = require('bcryptjs');

/**
 * Get admin dashboard overview
 */
router.get('/dashboard', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const db = getDatabase();
    
    // Get platform statistics
    const stats = await Promise.all([
      // Total tenants
      db('tenants').count('id as count').first(),
      
      // Active subscriptions
      db('tenants').where('subscription_status', 'active').count('id as count').first(),
      
      // Trial subscriptions
      db('tenants').where('subscription_status', 'trialing').count('id as count').first(),
      
      // Total conversations this month
      db('conversations')
        .whereRaw('created_at >= date_trunc(\'month\', CURRENT_DATE)')
        .count('id as count')
        .first(),
      
      // Total leads this month
      db('leads')
        .whereRaw('created_at >= date_trunc(\'month\', CURRENT_DATE)')
        .count('id as count')
        .first(),
      
      // Total appointments this month
      db('appointments')
        .whereRaw('created_at >= date_trunc(\'month\', CURRENT_DATE)')
        .count('id as count')
        .first(),
      
      // Revenue this month (from active subscriptions)
      db('tenants')
        .whereIn('subscription_plan', ['basic', 'pro', 'enterprise'])
        .where('subscription_status', 'active')
        .select('subscription_plan')
    ]);

    // Calculate revenue
    const planPrices = { basic: 299, pro: 599, enterprise: 1299 };
    const monthlyRevenue = stats[6].reduce((total, tenant) => {
      return total + (planPrices[tenant.subscription_plan] || 0);
    }, 0);

    const dashboardData = {
      platform_stats: {
        total_tenants: parseInt(stats[0].count),
        active_subscriptions: parseInt(stats[1].count),
        trial_subscriptions: parseInt(stats[2].count),
        monthly_conversations: parseInt(stats[3].count),
        monthly_leads: parseInt(stats[4].count),
        monthly_appointments: parseInt(stats[5].count),
        monthly_revenue: monthlyRevenue
      }
    };

    res.json({
      success: true,
      dashboard: dashboardData
    });
  } catch (error) {
    logger.error('Error getting admin dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard data'
    });
  }
});

/**
 * Get all tenants with pagination and filters
 */
router.get('/tenants', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status = 'all', 
      plan = 'all',
      search = '' 
    } = req.query;

    const db = getDatabase();
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = db('tenants')
      .select([
        'tenants.id',
        'tenants.name',
        'tenants.subdomain',
        'tenants.subscription_status',
        'tenants.subscription_plan',
        'tenants.trial_ends_at',
        'tenants.created_at',
        'tenants.updated_at',
        db.raw('COUNT(users.id) as user_count'),
        db.raw('COUNT(conversations.id) as conversation_count'),
        db.raw('COUNT(leads.id) as lead_count')
      ])
      .leftJoin('users', 'tenants.id', 'users.tenant_id')
      .leftJoin('conversations', 'tenants.id', 'conversations.tenant_id')
      .leftJoin('leads', 'tenants.id', 'leads.tenant_id')
      .groupBy('tenants.id');

    // Apply filters
    if (status !== 'all') {
      query = query.where('tenants.subscription_status', status);
    }

    if (plan !== 'all') {
      query = query.where('tenants.subscription_plan', plan);
    }

    if (search) {
      query = query.where(function() {
        this.where('tenants.name', 'ilike', `%${search}%`)
          .orWhere('tenants.subdomain', 'ilike', `%${search}%`);
      });
    }

    // Get total count for pagination
    const totalQuery = db('tenants');
    if (status !== 'all') totalQuery.where('subscription_status', status);
    if (plan !== 'all') totalQuery.where('subscription_plan', plan);
    if (search) {
      totalQuery.where(function() {
        this.where('name', 'ilike', `%${search}%`)
          .orWhere('subdomain', 'ilike', `%${search}%`);
      });
    }

    const [tenants, totalCount] = await Promise.all([
      query.limit(parseInt(limit)).offset(offset).orderBy('created_at', 'desc'),
      totalQuery.count('id as count').first()
    ]);

    res.json({
      success: true,
      tenants: tenants.map(tenant => ({
        ...tenant,
        user_count: parseInt(tenant.user_count),
        conversation_count: parseInt(tenant.conversation_count),
        lead_count: parseInt(tenant.lead_count)
      })),
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total_items: parseInt(totalCount.count),
        total_pages: Math.ceil(parseInt(totalCount.count) / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('Error getting tenants:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tenants'
    });
  }
});

/**
 * Get tenant details
 */
router.get('/tenants/:tenantId', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { tenantId } = req.params;
    const db = getDatabase();

    const [tenant, users, stats] = await Promise.all([
      db('tenants').where('id', tenantId).first(),
      db('users').where('tenant_id', tenantId).select(['id', 'email', 'first_name', 'last_name', 'role', 'created_at']),
      db.raw(`
        SELECT 
          (SELECT COUNT(*) FROM conversations WHERE tenant_id = ?) as total_conversations,
          (SELECT COUNT(*) FROM leads WHERE tenant_id = ?) as total_leads,
          (SELECT COUNT(*) FROM appointments WHERE tenant_id = ?) as total_appointments,
          (SELECT COUNT(*) FROM email_logs WHERE tenant_id = ? AND status = 'sent') as emails_sent
      `, [tenantId, tenantId, tenantId, tenantId])
    ]);

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    res.json({
      success: true,
      tenant: {
        ...tenant,
        branding: typeof tenant.branding === 'string' ? JSON.parse(tenant.branding) : tenant.branding,
        settings: typeof tenant.settings === 'string' ? JSON.parse(tenant.settings) : tenant.settings
      },
      users,
      statistics: stats.rows[0]
    });
  } catch (error) {
    logger.error('Error getting tenant details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tenant details'
    });
  }
});

/**
 * Update tenant subscription
 */
router.patch('/tenants/:tenantId/subscription', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { status, plan, trial_ends_at } = req.body;

    const db = getDatabase();
    const updates = {};

    if (status) updates.subscription_status = status;
    if (plan) updates.subscription_plan = plan;
    if (trial_ends_at) updates.trial_ends_at = new Date(trial_ends_at);
    updates.updated_at = db.fn.now();

    await db('tenants').where('id', tenantId).update(updates);

    logger.info(`Admin updated tenant ${tenantId} subscription: ${JSON.stringify(updates)}`);

    res.json({
      success: true,
      message: 'Tenant subscription updated successfully'
    });
  } catch (error) {
    logger.error('Error updating tenant subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update tenant subscription'
    });
  }
});

/**
 * Suspend/unsuspend tenant
 */
router.patch('/tenants/:tenantId/status', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { action } = req.body; // 'suspend' or 'activate'

    if (!['suspend', 'activate'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Use "suspend" or "activate"'
      });
    }

    const db = getDatabase();
    const status = action === 'suspend' ? 'suspended' : 'active';

    await db('tenants').where('id', tenantId).update({
      subscription_status: status,
      updated_at: db.fn.now()
    });

    logger.info(`Admin ${action}d tenant ${tenantId}`);

    res.json({
      success: true,
      message: `Tenant ${action}d successfully`
    });
  } catch (error) {
    logger.error(`Error ${req.body.action}ing tenant:`, error);
    res.status(500).json({
      success: false,
      message: `Failed to ${req.body.action} tenant`
    });
  }
});

/**
 * Get platform analytics
 */
router.get('/analytics', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const db = getDatabase();
    const periodDays = parseInt(period);

    const [
      tenantGrowth,
      subscriptionBreakdown,
      revenueData,
      usageStats,
      conversionMetrics
    ] = await Promise.all([
      // Tenant growth over time
      db.raw(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as new_tenants
        FROM tenants 
        WHERE created_at >= NOW() - INTERVAL '${periodDays} days'
        GROUP BY DATE(created_at)
        ORDER BY date
      `),

      // Subscription plan breakdown
      db('tenants')
        .select('subscription_plan', 'subscription_status')
        .count('id as count')
        .groupBy('subscription_plan', 'subscription_status'),

      // Revenue trends
      db.raw(`
        SELECT 
          DATE(created_at) as date,
          subscription_plan,
          COUNT(*) as subscriptions
        FROM tenants 
        WHERE subscription_status = 'active' 
        AND created_at >= NOW() - INTERVAL '${periodDays} days'
        GROUP BY DATE(created_at), subscription_plan
        ORDER BY date
      `),

      // Platform usage statistics
      db.raw(`
        SELECT 
          (SELECT COUNT(*) FROM conversations WHERE created_at >= NOW() - INTERVAL '${periodDays} days') as total_conversations,
          (SELECT COUNT(*) FROM leads WHERE created_at >= NOW() - INTERVAL '${periodDays} days') as total_leads,
          (SELECT COUNT(*) FROM appointments WHERE created_at >= NOW() - INTERVAL '${periodDays} days') as total_appointments,
          (SELECT AVG(conversation_count) FROM (
            SELECT COUNT(*) as conversation_count 
            FROM conversations 
            WHERE created_at >= NOW() - INTERVAL '${periodDays} days'
            GROUP BY tenant_id
          ) as avg_calc) as avg_conversations_per_tenant
      `),

      // Conversion metrics
      db.raw(`
        SELECT 
          t.id as tenant_id,
          t.name as tenant_name,
          COUNT(DISTINCT c.id) as conversations,
          COUNT(DISTINCT l.id) as leads,
          COUNT(DISTINCT a.id) as appointments,
          CASE 
            WHEN COUNT(DISTINCT c.id) > 0 
            THEN ROUND((COUNT(DISTINCT l.id)::float / COUNT(DISTINCT c.id)) * 100, 2)
            ELSE 0 
          END as conversation_to_lead_rate,
          CASE 
            WHEN COUNT(DISTINCT l.id) > 0 
            THEN ROUND((COUNT(DISTINCT a.id)::float / COUNT(DISTINCT l.id)) * 100, 2)
            ELSE 0 
          END as lead_to_appointment_rate
        FROM tenants t
        LEFT JOIN conversations c ON t.id = c.tenant_id AND c.created_at >= NOW() - INTERVAL '${periodDays} days'
        LEFT JOIN leads l ON t.id = l.tenant_id AND l.created_at >= NOW() - INTERVAL '${periodDays} days'
        LEFT JOIN appointments a ON t.id = a.tenant_id AND a.created_at >= NOW() - INTERVAL '${periodDays} days'
        WHERE t.subscription_status IN ('active', 'trialing')
        GROUP BY t.id, t.name
        HAVING COUNT(DISTINCT c.id) > 0
        ORDER BY conversations DESC
        LIMIT 10
      `)
    ]);

    res.json({
      success: true,
      analytics: {
        period_days: periodDays,
        tenant_growth: tenantGrowth.rows,
        subscription_breakdown: subscriptionBreakdown,
        revenue_data: revenueData.rows,
        usage_stats: usageStats.rows[0],
        top_tenants_conversion: conversionMetrics.rows
      }
    });
  } catch (error) {
    logger.error('Error getting platform analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data'
    });
  }
});

/**
 * Get system health and status
 */
router.get('/system/health', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const db = getDatabase();
    
    // Check database connection
    const dbHealth = await db.raw('SELECT 1 as healthy').then(() => true).catch(() => false);
    
    // Check recent activity
    const [recentStats] = await db.raw(`
      SELECT 
        (SELECT COUNT(*) FROM conversations WHERE created_at >= NOW() - INTERVAL '24 hours') as conversations_24h,
        (SELECT COUNT(*) FROM leads WHERE created_at >= NOW() - INTERVAL '24 hours') as leads_24h,
        (SELECT COUNT(*) FROM appointments WHERE created_at >= NOW() - INTERVAL '24 hours') as appointments_24h,
        (SELECT COUNT(*) FROM email_logs WHERE created_at >= NOW() - INTERVAL '24 hours') as emails_24h
    `).then(result => result.rows);

    // Check for any system errors
    const errorCount = await db('email_logs')
      .where('status', 'failed')
      .where('created_at', '>=', db.raw("NOW() - INTERVAL '24 hours'"))
      .count('id as count')
      .first();

    const systemHealth = {
      status: dbHealth ? 'healthy' : 'unhealthy',
      database: dbHealth ? 'connected' : 'disconnected',
      last_24_hours: {
        conversations: parseInt(recentStats.conversations_24h),
        leads: parseInt(recentStats.leads_24h),
        appointments: parseInt(recentStats.appointments_24h),
        emails_sent: parseInt(recentStats.emails_24h),
        email_failures: parseInt(errorCount.count)
      },
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      system_health: systemHealth
    });
  } catch (error) {
    logger.error('Error checking system health:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check system health',
      system_health: {
        status: 'unhealthy',
        database: 'unknown',
        error: error.message
      }
    });
  }
});

/**
 * Create new admin user
 */
router.post('/users', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { email, password, firstName, lastName, role = 'admin' } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, firstName, and lastName are required'
      });
    }

    const db = getDatabase();

    // Check if user already exists
    const existingUser = await db('users').where('email', email).first();
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user (no tenant_id for platform admins)
    const [newUser] = await db('users').insert({
      email,
      password: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      role,
      is_active: true,
      tenant_id: null // Platform admin
    }).returning(['id', 'email', 'first_name', 'last_name', 'role', 'created_at']);

    logger.info(`New admin user created: ${email} by ${req.user.email}`);

    res.json({
      success: true,
      message: 'Admin user created successfully',
      user: newUser
    });
  } catch (error) {
    logger.error('Error creating admin user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create admin user'
    });
  }
});

/**
 * Get platform configuration
 */
router.get('/config', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const config = {
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      features: {
        email_service: !!process.env.SMTP_HOST,
        calendar_integration: !!process.env.GOOGLE_CLIENT_ID,
        stripe_billing: !!process.env.STRIPE_SECRET_KEY,
        ai_service: !!process.env.OLLAMA_BASE_URL
      },
      limits: {
        basic_plan: {
          conversations: 500,
          emails: 1000
        },
        pro_plan: {
          conversations: 2000,
          emails: 5000
        },
        enterprise_plan: {
          conversations: 'unlimited',
          emails: 'unlimited'
        }
      }
    };

    res.json({
      success: true,
      config
    });
  } catch (error) {
    logger.error('Error getting platform config:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch platform configuration'
    });
  }
});

module.exports = router;