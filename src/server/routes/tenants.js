const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { getDatabase } = require('../config/db');
const { clearTenantCache } = require('../middleware/tenant');
const logger = require('../utils/logger');

const router = express.Router();

// Get current tenant information
router.get('/current', asyncHandler(async (req, res) => {
  const tenant = req.tenant;
  
  res.json({
    id: tenant.id,
    name: tenant.name,
    subdomain: tenant.subdomain,
    customDomain: tenant.customDomain,
    branding: tenant.branding,
    settings: tenant.settings,
    status: tenant.status,
    subscriptionStatus: tenant.subscriptionStatus,
    trialEndsAt: tenant.trialEndsAt
  });
}));

// Update tenant settings (admin only)
router.put('/current/settings', 
  authenticateToken, 
  requireRole(['admin']),
  [
    body('name').optional().trim().isLength({ min: 1 }),
    body('branding').optional().isObject(),
    body('settings').optional().isObject()
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, branding, settings } = req.body;
    const db = getDatabase();

    const updateData = {};
    if (name) updateData.name = name;
    if (branding) updateData.branding = JSON.stringify(branding);
    if (settings) updateData.settings = JSON.stringify(settings);
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updateData.updated_at = db.fn.now();

    const [updatedTenant] = await db('tenants')
      .where({ id: req.tenant.id })
      .update(updateData)
      .returning('*');

    // Clear cache
    await clearTenantCache(req.tenant.subdomain);
    if (req.tenant.customDomain) {
      await clearTenantCache(req.tenant.customDomain);
    }

    logger.info(`Tenant settings updated: ${req.tenant.subdomain} by ${req.user.email}`);

    res.json({
      id: updatedTenant.id,
      name: updatedTenant.name,
      subdomain: updatedTenant.subdomain,
      customDomain: updatedTenant.custom_domain,
      branding: updatedTenant.branding,
      settings: updatedTenant.settings,
      status: updatedTenant.status,
      subscriptionStatus: updatedTenant.subscription_status,
      updatedAt: updatedTenant.updated_at
    });
  })
);

// Get tenant analytics
router.get('/current/analytics', 
  authenticateToken, 
  requireRole(['admin', 'attorney']),
  asyncHandler(async (req, res) => {
    const db = getDatabase();
    const { period = '30d' } = req.query;

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

    // Get leads stats
    const leadsStats = await db('leads')
      .where({ tenant_id: req.tenant.id })
      .where(dateFilter)
      .select(
        db.raw('COUNT(*) as total_leads'),
        db.raw('COUNT(*) FILTER (WHERE status = ?) as new_leads', ['new']),
        db.raw('COUNT(*) FILTER (WHERE status = ?) as converted_leads', ['converted']),
        db.raw('COUNT(*) FILTER (WHERE consultation_scheduled_at IS NOT NULL) as scheduled_consultations')
      )
      .first();

    // Get conversations stats
    const conversationsStats = await db('conversations')
      .where({ tenant_id: req.tenant.id })
      .where(dateFilter)
      .select(
        db.raw('COUNT(*) as total_conversations'),
        db.raw('COUNT(*) FILTER (WHERE status = ?) as completed_conversations', ['completed']),
        db.raw('AVG(message_count) as avg_messages_per_conversation')
      )
      .first();

    // Get daily stats for charts
    const dailyStats = await db('leads')
      .where({ tenant_id: req.tenant.id })
      .where(dateFilter)
      .select(
        db.raw('DATE(created_at) as date'),
        db.raw('COUNT(*) as leads_count')
      )
      .groupBy(db.raw('DATE(created_at)'))
      .orderBy('date');

    res.json({
      period,
      leads: {
        total: parseInt(leadsStats.total_leads) || 0,
        new: parseInt(leadsStats.new_leads) || 0,
        converted: parseInt(leadsStats.converted_leads) || 0,
        scheduledConsultations: parseInt(leadsStats.scheduled_consultations) || 0,
        conversionRate: leadsStats.total_leads > 0 
          ? ((leadsStats.converted_leads / leadsStats.total_leads) * 100).toFixed(2)
          : 0
      },
      conversations: {
        total: parseInt(conversationsStats.total_conversations) || 0,
        completed: parseInt(conversationsStats.completed_conversations) || 0,
        avgMessagesPerConversation: parseFloat(conversationsStats.avg_messages_per_conversation) || 0
      },
      dailyStats
    });
  })
);

// Get tenant users (admin only)
router.get('/current/users', 
  authenticateToken, 
  requireRole(['admin']),
  asyncHandler(async (req, res) => {
    const db = getDatabase();
    
    const users = await db('users')
      .where({ tenant_id: req.tenant.id })
      .select(['id', 'email', 'first_name', 'last_name', 'role', 'status', 'last_login_at', 'created_at'])
      .orderBy('created_at', 'desc');

    res.json({
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        status: user.status,
        lastLoginAt: user.last_login_at,
        createdAt: user.created_at
      }))
    });
  })
);

module.exports = router;