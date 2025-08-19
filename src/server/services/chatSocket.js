const jwt = require('jsonwebtoken');
const { getDatabase } = require('../config/db');
const { getRedisClient } = require('../config/redis');
const logger = require('../utils/logger');

class ChatSocketService {
  constructor(io) {
    this.io = io;
    this.activeConnections = new Map(); // Store active connections
    this.setupSocketHandlers();
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      logger.info(`Socket connected: ${socket.id}`);

      // Handle tenant context
      socket.on('join_tenant', async (data) => {
        try {
          await this.handleTenantJoin(socket, data);
        } catch (error) {
          logger.error('Error joining tenant:', error);
          socket.emit('error', { message: 'Failed to join tenant context' });
        }
      });

      // Handle visitor joining a conversation
      socket.on('join_conversation', async (data) => {
        try {
          await this.handleConversationJoin(socket, data);
        } catch (error) {
          logger.error('Error joining conversation:', error);
          socket.emit('error', { message: 'Failed to join conversation' });
        }
      });

      // Handle new message from visitor
      socket.on('visitor_message', async (data) => {
        try {
          await this.handleVisitorMessage(socket, data);
        } catch (error) {
          logger.error('Error handling visitor message:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      // Handle attorney joining conversation
      socket.on('attorney_join', async (data) => {
        try {
          await this.handleAttorneyJoin(socket, data);
        } catch (error) {
          logger.error('Error attorney joining:', error);
          socket.emit('error', { message: 'Failed to join as attorney' });
        }
      });

      // Handle attorney message
      socket.on('attorney_message', async (data) => {
        try {
          await this.handleAttorneyMessage(socket, data);
        } catch (error) {
          logger.error('Error handling attorney message:', error);
          socket.emit('error', { message: 'Failed to send attorney message' });
        }
      });

      // Handle typing indicators
      socket.on('typing_start', (data) => {
        this.handleTypingStart(socket, data);
      });

      socket.on('typing_stop', (data) => {
        this.handleTypingStop(socket, data);
      });

      // Handle conversation end
      socket.on('end_conversation', async (data) => {
        try {
          await this.handleConversationEnd(socket, data);
        } catch (error) {
          logger.error('Error ending conversation:', error);
          socket.emit('error', { message: 'Failed to end conversation' });
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });
    });
  }

  async handleTenantJoin(socket, data) {
    const { tenantId, visitorId } = data;
    
    if (!tenantId) {
      socket.emit('error', { message: 'Tenant ID required' });
      return;
    }

    // Verify tenant exists
    const db = getDatabase();
    const tenant = await db('tenants').where({ id: tenantId }).first();
    
    if (!tenant) {
      socket.emit('error', { message: 'Tenant not found' });
      return;
    }

    // Store tenant context
    socket.tenantId = tenantId;
    socket.visitorId = visitorId;
    
    // Join tenant room for broadcasts
    socket.join(`tenant_${tenantId}`);
    
    socket.emit('tenant_joined', { 
      tenantId, 
      tenantName: tenant.name,
      branding: tenant.branding 
    });
    
    logger.info(`Socket ${socket.id} joined tenant ${tenantId}`);
  }

  async handleConversationJoin(socket, data) {
    const { conversationId, visitorId } = data;
    
    if (!socket.tenantId) {
      socket.emit('error', { message: 'Must join tenant first' });
      return;
    }

    const db = getDatabase();
    
    // Get or create conversation
    let conversation;
    if (conversationId) {
      conversation = await db('conversations')
        .where({ id: conversationId, tenant_id: socket.tenantId })
        .first();
    }

    if (!conversation) {
      // Create new conversation
      const [newConversation] = await db('conversations')
        .insert({
          tenant_id: socket.tenantId,
          visitor_id: visitorId || socket.id,
          status: 'active',
          visitor_info: JSON.stringify({
            socketId: socket.id,
            userAgent: socket.handshake.headers['user-agent'],
            ip: socket.handshake.address
          })
        })
        .returning('*');
      
      conversation = newConversation;
      logger.info(`New conversation created: ${conversation.id}`);
    }

    // Store conversation context
    socket.conversationId = conversation.id;
    socket.join(`conversation_${conversation.id}`);
    
    // Track active connection
    this.activeConnections.set(socket.id, {
      tenantId: socket.tenantId,
      conversationId: conversation.id,
      visitorId: socket.visitorId,
      joinedAt: new Date()
    });

    // Get conversation history
    const messages = await db('messages')
      .where({ conversation_id: conversation.id })
      .leftJoin('users', 'messages.sender_id', 'users.id')
      .select([
        'messages.*',
        'users.first_name as sender_first_name',
        'users.last_name as sender_last_name'
      ])
      .orderBy('messages.sent_at', 'asc');

    socket.emit('conversation_joined', {
      conversationId: conversation.id,
      status: conversation.status,
      messages: messages.map(msg => ({
        id: msg.id,
        senderType: msg.sender_type,
        senderId: msg.sender_id,
        senderName: msg.sender_first_name ? 
          `${msg.sender_first_name} ${msg.sender_last_name}` : null,
        content: msg.content,
        metadata: msg.metadata,
        sentAt: msg.sent_at
      }))
    });

    // Notify tenant admins of new visitor
    this.io.to(`tenant_${socket.tenantId}_admins`).emit('visitor_joined', {
      conversationId: conversation.id,
      visitorId: socket.visitorId,
      socketId: socket.id
    });
  }

  async handleVisitorMessage(socket, data) {
    const { content, metadata = {} } = data;
    
    if (!socket.conversationId || !content?.trim()) {
      socket.emit('error', { message: 'Invalid message data' });
      return;
    }

    const db = getDatabase();
    
    // Save message to database
    const [message] = await db('messages')
      .insert({
        conversation_id: socket.conversationId,
        sender_type: 'visitor',
        sender_id: null,
        content: content.trim(),
        metadata: JSON.stringify(metadata)
      })
      .returning('*');

    // Update conversation message count
    await db('conversations')
      .where({ id: socket.conversationId })
      .increment('message_count', 1)
      .update({ updated_at: db.fn.now() });

    const messageData = {
      id: message.id,
      conversationId: socket.conversationId,
      senderType: 'visitor',
      senderId: null,
      senderName: null,
      content: message.content,
      metadata: message.metadata,
      sentAt: message.sent_at
    };

    // Broadcast to conversation room
    this.io.to(`conversation_${socket.conversationId}`).emit('message', messageData);
    
    // Notify tenant admins
    this.io.to(`tenant_${socket.tenantId}_admins`).emit('new_visitor_message', {
      conversationId: socket.conversationId,
      message: messageData
    });

    logger.info(`Visitor message sent in conversation ${socket.conversationId}`);
  }

  async handleAttorneyJoin(socket, data) {
    const { token, conversationId } = data;
    
    if (!token) {
      socket.emit('error', { message: 'Authentication token required' });
      return;
    }

    try {
      // Verify JWT token
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const db = getDatabase();
      
      // Get user details
      const user = await db('users')
        .where({ id: payload.userId })
        .first();

      if (!user || (user.role !== 'attorney' && user.role !== 'admin')) {
        socket.emit('error', { message: 'Unauthorised' });
        return;
      }

      // Store attorney context
      socket.userId = user.id;
      socket.tenantId = user.tenant_id;
      socket.userRole = user.role;
      socket.userName = `${user.first_name} ${user.last_name}`;

      // Join tenant admin room
      socket.join(`tenant_${user.tenant_id}_admins`);
      
      if (conversationId) {
        socket.join(`conversation_${conversationId}`);
        socket.conversationId = conversationId;
      }

      socket.emit('attorney_joined', {
        userId: user.id,
        userName: socket.userName,
        role: user.role,
        conversationId
      });

      logger.info(`Attorney ${user.email} joined via socket ${socket.id}`);
    } catch (error) {
      socket.emit('error', { message: 'Invalid authentication token' });
    }
  }

  async handleAttorneyMessage(socket, data) {
    const { content, conversationId, metadata = {} } = data;
    
    if (!socket.userId || !content?.trim() || !conversationId) {
      socket.emit('error', { message: 'Invalid message data' });
      return;
    }

    const db = getDatabase();
    
    // Save message to database
    const [message] = await db('messages')
      .insert({
        conversation_id: conversationId,
        sender_type: 'attorney',
        sender_id: socket.userId,
        content: content.trim(),
        metadata: JSON.stringify(metadata)
      })
      .returning('*');

    // Update conversation message count
    await db('conversations')
      .where({ id: conversationId })
      .increment('message_count', 1)
      .update({ updated_at: db.fn.now() });

    const messageData = {
      id: message.id,
      conversationId,
      senderType: 'attorney',
      senderId: socket.userId,
      senderName: socket.userName,
      content: message.content,
      metadata: message.metadata,
      sentAt: message.sent_at
    };

    // Broadcast to conversation room
    this.io.to(`conversation_${conversationId}`).emit('message', messageData);

    logger.info(`Attorney message sent in conversation ${conversationId}`);
  }

  handleTypingStart(socket, data) {
    const { conversationId } = data;
    if (conversationId) {
      socket.to(`conversation_${conversationId}`).emit('typing_start', {
        senderId: socket.userId || 'visitor',
        senderName: socket.userName || 'Visitor'
      });
    }
  }

  handleTypingStop(socket, data) {
    const { conversationId } = data;
    if (conversationId) {
      socket.to(`conversation_${conversationId}`).emit('typing_stop', {
        senderId: socket.userId || 'visitor'
      });
    }
  }

  async handleConversationEnd(socket, data) {
    const { conversationId } = data;
    
    if (!conversationId) {
      socket.emit('error', { message: 'Conversation ID required' });
      return;
    }

    const db = getDatabase();
    
    // Update conversation status
    await db('conversations')
      .where({ id: conversationId })
      .update({
        status: 'completed',
        ended_at: db.fn.now(),
        updated_at: db.fn.now()
      });

    // Notify all participants
    this.io.to(`conversation_${conversationId}`).emit('conversation_ended', {
      conversationId,
      endedAt: new Date().toISOString()
    });

    logger.info(`Conversation ended: ${conversationId}`);
  }

  handleDisconnect(socket) {
    logger.info(`Socket disconnected: ${socket.id}`);
    
    // Clean up active connection
    const connection = this.activeConnections.get(socket.id);
    if (connection) {
      this.activeConnections.delete(socket.id);
      
      // Notify tenant admins of visitor disconnect
      if (!socket.userId) { // Was a visitor
        this.io.to(`tenant_${connection.tenantId}_admins`).emit('visitor_disconnected', {
          conversationId: connection.conversationId,
          visitorId: connection.visitorId,
          socketId: socket.id
        });
      }
    }
  }

  // Helper method to get active conversations for a tenant
  getActiveConversations(tenantId) {
    const conversations = [];
    for (const [socketId, connection] of this.activeConnections.entries()) {
      if (connection.tenantId === tenantId) {
        conversations.push({
          socketId,
          conversationId: connection.conversationId,
          visitorId: connection.visitorId,
          joinedAt: connection.joinedAt
        });
      }
    }
    return conversations;
  }

  // Method to send message from bot/AI service
  async sendBotMessage(conversationId, content, metadata = {}) {
    const db = getDatabase();
    
    // Save bot message to database
    const [message] = await db('messages')
      .insert({
        conversation_id: conversationId,
        sender_type: 'bot',
        sender_id: null,
        content,
        metadata: JSON.stringify(metadata)
      })
      .returning('*');

    // Update conversation message count
    await db('conversations')
      .where({ id: conversationId })
      .increment('message_count', 1)
      .update({ updated_at: db.fn.now() });

    const messageData = {
      id: message.id,
      conversationId,
      senderType: 'bot',
      senderId: null,
      senderName: 'Legal Assistant',
      content: message.content,
      metadata: message.metadata,
      sentAt: message.sent_at
    };

    // Broadcast to conversation room
    this.io.to(`conversation_${conversationId}`).emit('message', messageData);
    
    return messageData;
  }
}

module.exports = (io) => {
  return new ChatSocketService(io);
};