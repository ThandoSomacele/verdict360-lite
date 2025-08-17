const express = require('express');
const { body, validationResult } = require('express-validator');
const { optionalAuth } = require('../middleware/auth');
const { chatRateLimit } = require('../middleware/rateLimit');
const { asyncHandler } = require('../middleware/errorHandler');
const { getDatabase } = require('../config/db');
const logger = require('../utils/logger');

const router = express.Router();

// Start new conversation
router.post('/conversations',
  chatRateLimit,
  [
    body('visitorId').trim().isLength({ min: 1 }).withMessage('Visitor ID required'),
    body('visitorInfo').optional().isObject()
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { visitorId, visitorInfo = {} } = req.body;
    const db = getDatabase();

    // Check for existing active conversation
    const existingConversation = await db('conversations')
      .where({ 
        tenant_id: req.tenant.id,
        visitor_id: visitorId,
        status: 'active'
      })
      .first();

    if (existingConversation) {
      return res.json({
        id: existingConversation.id,
        visitorId: existingConversation.visitor_id,
        status: existingConversation.status,
        startedAt: existingConversation.started_at
      });
    }

    // Create new conversation
    const [conversation] = await db('conversations')
      .insert({
        tenant_id: req.tenant.id,
        visitor_id: visitorId,
        visitor_info: JSON.stringify(visitorInfo),
        status: 'active'
      })
      .returning('*');

    logger.info(`New conversation started: ${conversation.id} for tenant ${req.tenant.subdomain}`);

    res.status(201).json({
      id: conversation.id,
      visitorId: conversation.visitor_id,
      status: conversation.status,
      startedAt: conversation.started_at
    });
  })
);

// Send message
router.post('/conversations/:conversationId/messages',
  chatRateLimit,
  [
    body('content').trim().isLength({ min: 1, max: 2000 }).withMessage('Message content required (max 2000 chars)'),
    body('senderType').isIn(['visitor', 'bot', 'attorney']).withMessage('Invalid sender type')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, senderType, metadata = {} } = req.body;
    const { conversationId } = req.params;
    const db = getDatabase();

    // Verify conversation exists and belongs to tenant
    const conversation = await db('conversations')
      .where({ id: conversationId, tenant_id: req.tenant.id })
      .first();

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (conversation.status !== 'active') {
      return res.status(400).json({ error: 'Conversation is not active' });
    }

    // Create message
    const [message] = await db('messages')
      .insert({
        conversation_id: conversationId,
        sender_type: senderType,
        sender_id: req.user?.id || null,
        content,
        metadata: JSON.stringify(metadata)
      })
      .returning('*');

    // Update conversation message count
    await db('conversations')
      .where({ id: conversationId })
      .increment('message_count', 1)
      .update({ updated_at: db.fn.now() });

    res.status(201).json({
      id: message.id,
      conversationId: message.conversation_id,
      senderType: message.sender_type,
      senderId: message.sender_id,
      content: message.content,
      metadata: message.metadata,
      sentAt: message.sent_at
    });
  })
);

// Get conversation messages
router.get('/conversations/:conversationId/messages',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    const db = getDatabase();

    // Verify conversation exists and belongs to tenant
    const conversation = await db('conversations')
      .where({ id: conversationId, tenant_id: req.tenant.id })
      .first();

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const messages = await db('messages')
      .where({ conversation_id: conversationId })
      .leftJoin('users', 'messages.sender_id', 'users.id')
      .select([
        'messages.*',
        'users.first_name as sender_first_name',
        'users.last_name as sender_last_name'
      ])
      .orderBy('messages.sent_at', 'asc')
      .limit(parseInt(limit))
      .offset(parseInt(offset));

    res.json({
      conversationId,
      messages: messages.map(message => ({
        id: message.id,
        senderType: message.sender_type,
        senderId: message.sender_id,
        senderName: message.sender_first_name ? 
          `${message.sender_first_name} ${message.sender_last_name}` : null,
        content: message.content,
        metadata: message.metadata,
        sentAt: message.sent_at
      }))
    });
  })
);

// End conversation
router.post('/conversations/:conversationId/end',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    const db = getDatabase();

    // Verify conversation exists and belongs to tenant
    const conversation = await db('conversations')
      .where({ id: conversationId, tenant_id: req.tenant.id })
      .first();

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const [updatedConversation] = await db('conversations')
      .where({ id: conversationId })
      .update({
        status: 'completed',
        ended_at: db.fn.now(),
        updated_at: db.fn.now()
      })
      .returning('*');

    logger.info(`Conversation ended: ${conversationId} for tenant ${req.tenant.subdomain}`);

    res.json({
      id: updatedConversation.id,
      status: updatedConversation.status,
      endedAt: updatedConversation.ended_at
    });
  })
);

// Get conversation history (authenticated users only)
router.get('/conversations',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, status, visitorId } = req.query;
    const db = getDatabase();

    let query = db('conversations')
      .where({ tenant_id: req.tenant.id })
      .leftJoin('leads', 'conversations.lead_id', 'leads.id')
      .select([
        'conversations.*',
        'leads.first_name as lead_first_name',
        'leads.last_name as lead_last_name',
        'leads.email as lead_email'
      ]);

    if (status) query = query.where('conversations.status', status);
    if (visitorId) query = query.where('conversations.visitor_id', visitorId);

    const offset = (page - 1) * limit;
    const conversations = await query
      .orderBy('conversations.started_at', 'desc')
      .limit(parseInt(limit))
      .offset(offset);

    res.json({
      conversations: conversations.map(conv => ({
        id: conv.id,
        visitorId: conv.visitor_id,
        status: conv.status,
        messageCount: conv.message_count,
        lead: conv.lead_id ? {
          id: conv.lead_id,
          firstName: conv.lead_first_name,
          lastName: conv.lead_last_name,
          email: conv.lead_email
        } : null,
        startedAt: conv.started_at,
        endedAt: conv.ended_at
      }))
    });
  })
);

module.exports = router;