import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import { AIService } from '$lib/services/aiService';
import type { ChatMessage, AIResponse } from '$lib/types';

const aiService = new AIService();

/**
 * Validate and sanitize tenant ID to prevent log injection
 * Only allows alphanumeric characters, hyphens, and underscores
 */
function sanitizeTenantId(tenantId: string): string {
  if (!tenantId || typeof tenantId !== 'string') {
    throw new Error('Invalid tenant ID');
  }

  // Only allow safe characters (alphanumeric, hyphen, underscore)
  const sanitized = tenantId.replace(/[^a-zA-Z0-9_-]/g, '');

  if (sanitized.length === 0 || sanitized.length > 100) {
    throw new Error('Invalid tenant ID format');
  }

  return sanitized;
}

export function setupSocketIO(server: HTTPServer) {
  const io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? [process.env.CLIENT_URL || 'https://verdict360.com'] 
        : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:4001'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    
    // Handle tenant-specific room joining
    socket.on('join-tenant', (tenantId: string) => {
      try {
        const safeTenantId = sanitizeTenantId(tenantId);
        const room = `tenant:${safeTenantId}`;
        socket.join(room);
        socket.data.tenantId = safeTenantId;
        console.log(`Socket ${socket.id} joined tenant room: ${room}`);
      } catch (error) {
        console.error('Invalid tenant ID on join-tenant:', error);
        socket.emit('error', { message: 'Invalid tenant ID' });
      }
    });

    // Handle chat messages
    socket.on('chat-message', async (data: {
      message: string;
      conversationHistory?: ChatMessage[];
      tenantId: string;
    }) => {
      try {
        const { message, conversationHistory = [], tenantId } = data;

        // Sanitize tenant ID to prevent log injection
        const safeTenantId = sanitizeTenantId(tenantId);

        // Emit typing indicator
        socket.to(`tenant:${safeTenantId}`).emit('typing', {
          isTyping: true,
          sender: 'ai'
        });

        // Get AI response
        const aiResponse: AIResponse = await aiService.generateResponse(
          message,
          conversationHistory,
          safeTenantId
        );

        // Stop typing indicator
        socket.to(`tenant:${safeTenantId}`).emit('typing', {
          isTyping: false,
          sender: 'ai'
        });

        // Send AI response back to client
        socket.emit('ai-response', {
          id: generateMessageId(),
          content: aiResponse.response,
          sender: 'ai',
          timestamp: new Date(),
          tenantId: safeTenantId,
          metadata: aiResponse.metadata
        });

        // Log the conversation (you might want to save to database)
        console.log(`[${safeTenantId}] User: ${message}`);
        console.log(`[${safeTenantId}] AI: ${aiResponse.response}`);

      } catch (error) {
        console.error('Socket chat error:', error);
        
        // Send error response
        socket.emit('ai-response', {
          id: generateMessageId(),
          content: 'I apologize, but I\'m experiencing technical difficulties. Please try again in a moment.',
          sender: 'ai',
          timestamp: new Date(),
          tenantId: data.tenantId,
          metadata: {
            intent: 'error',
            shouldOfferConsultation: false,
            isDataCollection: false,
            tenantId: data.tenantId
          }
        });
      }
    });

    // Handle typing indicators
    socket.on('typing', (data: { isTyping: boolean; tenantId: string }) => {
      try {
        const safeTenantId = sanitizeTenantId(data.tenantId);
        socket.to(`tenant:${safeTenantId}`).emit('typing', {
          isTyping: data.isTyping,
          sender: 'user',
          socketId: socket.id
        });
      } catch (error) {
        console.error('Invalid tenant ID in typing indicator:', error);
      }
    });

    // Handle contact form submission
    socket.on('submit-contact', async (data: {
      contactInfo: {
        name: string;
        email: string;
        phone: string;
        company?: string;
        message?: string;
      };
      tenantId: string;
    }) => {
      try {
        const { contactInfo, tenantId } = data;

        // Sanitize tenant ID to prevent log injection
        const safeTenantId = sanitizeTenantId(tenantId);

        // Here you would typically save to database and trigger calendar booking
        // For now, just acknowledge receipt
        socket.emit('contact-submitted', {
          success: true,
          message: 'Thank you! Your information has been received. We will contact you shortly to schedule your consultation.'
        });

        // Send follow-up AI message
        socket.emit('ai-response', {
          id: generateMessageId(),
          content: 'Perfect! I\'ve received your contact information. Our team will reach out within the next business day to schedule your consultation. Is there anything else I can help you with in the meantime?',
          sender: 'ai',
          timestamp: new Date(),
          tenantId: safeTenantId,
          metadata: {
            intent: 'consultation_scheduled',
            shouldOfferConsultation: false,
            isDataCollection: false,
            tenantId: safeTenantId
          }
        });

        console.log(`[${safeTenantId}] Contact form submitted:`, contactInfo);

      } catch (error) {
        console.error('Contact submission error:', error);
        socket.emit('contact-submitted', {
          success: false,
          message: 'There was an error submitting your information. Please try again.'
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}