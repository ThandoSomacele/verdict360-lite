import { Server } from 'socket.io';
import { handler } from './build/handler.js';
import express from 'express';
import { createServer } from 'http';

const app = express();
const server = createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? [process.env.CLIENT_URL || 'https://verdict360.com']
      : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:4001'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Handle tenant-specific room joining
  socket.on('join-tenant', (tenantId) => {
    const room = `tenant:${tenantId}`;
    socket.join(room);
    socket.data.tenantId = tenantId;
    console.log(`Socket ${socket.id} joined tenant room: ${room}`);
  });

  // Handle chat messages
  socket.on('chat-message', async (data) => {
    try {
      const { message, conversationHistory = [], tenantId } = data;

      // Emit typing indicator
      socket.emit('typing', {
        isTyping: true,
        sender: 'ai'
      });

      // Call AI service via internal API
      const response = await fetch(`http://localhost:${process.env.PORT || 3000}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Id': tenantId
        },
        body: JSON.stringify({
          message,
          conversationHistory
        })
      });

      const aiResponse = await response.json();

      // Stop typing indicator
      socket.emit('typing', {
        isTyping: false,
        sender: 'ai'
      });

      // Send AI response
      socket.emit('ai-response', {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content: aiResponse.response,
        sender: 'ai',
        senderType: 'bot',
        sentAt: new Date().toISOString(),
        tenantId,
        metadata: aiResponse.metadata
      });

      console.log(`[${tenantId}] Message processed`);

    } catch (error) {
      console.error('Socket chat error:', error);

      socket.emit('ai-response', {
        id: `error_${Date.now()}`,
        content: 'I apologize, but I\'m experiencing technical difficulties. Please try again.',
        sender: 'ai',
        senderType: 'bot',
        sentAt: new Date().toISOString(),
        tenantId: data.tenantId,
        metadata: {
          intent: 'error',
          shouldOfferConsultation: false,
          isDataCollection: false
        }
      });
    }
  });

  // Handle contact form submission
  socket.on('submit-contact', async (data) => {
    try {
      const { contactInfo, tenantId } = data;

      // Submit via internal API
      const response = await fetch(`http://localhost:${process.env.PORT || 3000}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Id': tenantId
        },
        body: JSON.stringify(contactInfo)
      });

      const result = await response.json();

      socket.emit('contact-submitted', {
        success: result.success,
        message: result.success
          ? 'Thank you! Your information has been received.'
          : 'Failed to submit contact information.'
      });

      if (result.success) {
        socket.emit('ai-response', {
          id: `confirmation_${Date.now()}`,
          content: 'Perfect! I\'ve received your contact information. Our team will reach out within the next business day.',
          sender: 'ai',
          senderType: 'bot',
          sentAt: new Date().toISOString(),
          tenantId,
          metadata: {
            intent: 'consultation_scheduled',
            shouldOfferConsultation: false,
            isDataCollection: false
          }
        });
      }

      console.log(`[${tenantId}] Contact form submitted`);

    } catch (error) {
      console.error('Contact submission error:', error);
      socket.emit('contact-submitted', {
        success: false,
        message: 'There was an error submitting your information.'
      });
    }
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Use SvelteKit handler for all routes
app.use(handler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.io enabled for real-time chat`);
});
