const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { authenticateToken, requireRole, optionalAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { getDatabase } = require('../config/db');
const logger = require('../utils/logger');
const emailService = require('../services/emailService');

const router = express.Router();

// Create new lead (public endpoint for chatbot)
router.post('/',
  [
    body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
    body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
    body('email').isEmail().normalizeEmail(),
    body('phone').optional().trim(),
    body('legalIssue').optional().trim(),
    body('consultationDetails').optional().isObject(),
    body('conversationId').optional().isUUID()
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, phone, legalIssue, consultationDetails, metadata, conversationId } = req.body;
    const db = getDatabase();

    // Check for existing lead with same email
    const existingLead = await db('leads')
      .where({ email, tenant_id: req.tenant.id })
      .where('status', '!=', 'closed')
      .first();

    if (existingLead) {
      return res.status(409).json({ 
        error: 'Lead already exists',
        leadId: existingLead.id 
      });
    }

    // Get legal issue from conversation if not provided
    let finalLegalIssue = legalIssue;
    if (!finalLegalIssue && conversationId) {
      // Extract legal issue from conversation messages
      const messages = await db('messages')
        .where({ conversation_id: conversationId, sender_type: 'visitor' })
        .orderBy('sent_at', 'asc');
      
      if (messages.length > 0) {
        finalLegalIssue = messages
          .map(msg => msg.content)
          .join(' ')
          .substring(0, 500); // Limit length
      }
    }

    const [lead] = await db('leads')
      .insert({
        tenant_id: req.tenant.id,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        legal_issue: finalLegalIssue,
        consultation_details: consultationDetails ? JSON.stringify(consultationDetails) : null,
        metadata: metadata ? JSON.stringify({
          ...metadata,
          conversationId: conversationId
        }) : JSON.stringify({ conversationId })
      })
      .returning('*');

    // Link conversation to lead if conversationId provided
    if (conversationId) {
      await db('conversations')
        .where({ id: conversationId })
        .update({ 
          lead_id: lead.id, 
          updated_at: db.fn.now() 
        });
    }

    logger.info(`New lead created: ${email} for tenant ${req.tenant.subdomain}`);

    // Send confirmation email to client
    try {
      await emailService.sendConsultationConfirmation(
        { firstName, lastName, email, phone },
        req.tenant,
        { type: 'initial_consultation', status: 'pending' }
      );
    } catch (error) {
      logger.error('Failed to send confirmation email:', error);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      id: lead.id,
      firstName: lead.first_name,
      lastName: lead.last_name,
      email: lead.email,
      phone: lead.phone,
      legalIssue: lead.legal_issue,
      status: lead.status,
      priority: lead.priority,
      consultationDetails: lead.consultation_details,
      createdAt: lead.created_at
    });
  })
);

// Get leads (authenticated users only)
router.get('/',
  authenticateToken,
  requireRole(['admin', 'attorney', 'staff']),
  [
    query('status').optional().isIn(['new', 'contacted', 'scheduled', 'converted', 'closed']),
    query('priority').optional().isIn(['low', 'medium', 'high']),
    query('assignedTo').optional().isUUID(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('search').optional().trim()
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      status, 
      priority, 
      assignedTo, 
      page = 1, 
      limit = 20,
      search 
    } = req.query;

    const db = getDatabase();
    let query = db('leads')
      .where({ tenant_id: req.tenant.id })
      .leftJoin('users', 'leads.assigned_attorney_id', 'users.id')
      .select([
        'leads.*',
        'users.first_name as attorney_first_name',
        'users.last_name as attorney_last_name',
        'users.email as attorney_email'
      ]);

    // Apply filters
    if (status) query = query.where('leads.status', status);
    if (priority) query = query.where('leads.priority', priority);
    if (assignedTo) query = query.where('leads.assigned_attorney_id', assignedTo);
    
    if (search) {
      query = query.where(function() {
        this.where('leads.first_name', 'ilike', `%${search}%`)
          .orWhere('leads.last_name', 'ilike', `%${search}%`)
          .orWhere('leads.email', 'ilike', `%${search}%`)
          .orWhere('leads.legal_issue', 'ilike', `%${search}%`);
      });
    }

    // Get total count for pagination
    const totalQuery = query.clone();
    const totalResult = await totalQuery.count('leads.id as count').first();
    const total = parseInt(totalResult.count);

    // Apply pagination
    const offset = (page - 1) * limit;
    const leads = await query
      .orderBy('leads.created_at', 'desc')
      .limit(limit)
      .offset(offset);

    res.json({
      leads: leads.map(lead => ({
        id: lead.id,
        firstName: lead.first_name,
        lastName: lead.last_name,
        email: lead.email,
        phone: lead.phone,
        legalIssue: lead.legal_issue,
        status: lead.status,
        priority: lead.priority,
        assignedAttorney: lead.assigned_attorney_id ? {
          id: lead.assigned_attorney_id,
          firstName: lead.attorney_first_name,
          lastName: lead.attorney_last_name,
          email: lead.attorney_email
        } : null,
        consultationDetails: lead.consultation_details,
        consultationScheduledAt: lead.consultation_scheduled_at,
        notes: lead.notes,
        createdAt: lead.created_at,
        updatedAt: lead.updated_at
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  })
);

// Get single lead
router.get('/:id',
  authenticateToken,
  requireRole(['admin', 'attorney', 'staff']),
  asyncHandler(async (req, res) => {
    const db = getDatabase();
    
    const lead = await db('leads')
      .where({ id: req.params.id, tenant_id: req.tenant.id })
      .leftJoin('users', 'leads.assigned_attorney_id', 'users.id')
      .select([
        'leads.*',
        'users.first_name as attorney_first_name',
        'users.last_name as attorney_last_name',
        'users.email as attorney_email'
      ])
      .first();

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json({
      id: lead.id,
      firstName: lead.first_name,
      lastName: lead.last_name,
      email: lead.email,
      phone: lead.phone,
      legalIssue: lead.legal_issue,
      status: lead.status,
      priority: lead.priority,
      assignedAttorney: lead.assigned_attorney_id ? {
        id: lead.assigned_attorney_id,
        firstName: lead.attorney_first_name,
        lastName: lead.attorney_last_name,
        email: lead.attorney_email
      } : null,
      consultationDetails: lead.consultation_details,
      consultationScheduledAt: lead.consultation_scheduled_at,
      notes: lead.notes,
      metadata: lead.metadata,
      createdAt: lead.created_at,
      updatedAt: lead.updated_at
    });
  })
);

// Update lead
router.put('/:id',
  authenticateToken,
  requireRole(['admin', 'attorney', 'staff']),
  [
    body('status').optional().isIn(['new', 'contacted', 'scheduled', 'converted', 'closed']),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    body('assignedAttorneyId').optional().isUUID(),
    body('consultationScheduledAt').optional().isISO8601(),
    body('notes').optional().trim()
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, priority, assignedAttorneyId, consultationScheduledAt, notes } = req.body;
    const db = getDatabase();

    // Check if lead exists and belongs to tenant
    const existingLead = await db('leads')
      .where({ id: req.params.id, tenant_id: req.tenant.id })
      .first();

    if (!existingLead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    // Validate assigned attorney belongs to tenant
    if (assignedAttorneyId) {
      const attorney = await db('users')
        .where({ id: assignedAttorneyId, tenant_id: req.tenant.id, role: 'attorney' })
        .first();
      
      if (!attorney) {
        return res.status(400).json({ error: 'Invalid attorney assignment' });
      }
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (assignedAttorneyId !== undefined) updateData.assigned_attorney_id = assignedAttorneyId;
    if (consultationScheduledAt) updateData.consultation_scheduled_at = consultationScheduledAt;
    if (notes !== undefined) updateData.notes = notes;
    updateData.updated_at = db.fn.now();

    const [updatedLead] = await db('leads')
      .where({ id: req.params.id })
      .update(updateData)
      .returning('*');

    logger.info(`Lead updated: ${updatedLead.id} by ${req.user.email}`);

    res.json({
      id: updatedLead.id,
      status: updatedLead.status,
      priority: updatedLead.priority,
      assignedAttorneyId: updatedLead.assigned_attorney_id,
      consultationScheduledAt: updatedLead.consultation_scheduled_at,
      notes: updatedLead.notes,
      updatedAt: updatedLead.updated_at
    });
  })
);

module.exports = router;