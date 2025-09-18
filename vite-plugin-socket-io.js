import { Server } from 'socket.io';
import { AIService } from './src/lib/services/aiService.ts';

const aiService = new AIService();

export function socketIoPlugin() {
  return {
    name: 'socket-io',
    configureServer(server) {
      if (!server.httpServer) return;

      const io = new Server(server.httpServer, {
        cors: {
          origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
          methods: ['GET', 'POST'],
          credentials: true
        }
      });

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
            socket.to(`tenant:${tenantId}`).emit('typing', { 
              isTyping: true, 
              sender: 'ai' 
            });

            // Get AI response
            const aiResponse = await aiService.generateResponse(
              message,
              conversationHistory,
              tenantId
            );

            // Stop typing indicator
            socket.to(`tenant:${tenantId}`).emit('typing', { 
              isTyping: false, 
              sender: 'ai' 
            });

            // Send AI response back to client
            socket.emit('ai-response', {
              id: generateMessageId(),
              content: aiResponse.response,
              sender: 'ai',
              senderType: 'bot',
              sentAt: new Date().toISOString(),
              tenantId,
              metadata: aiResponse.metadata
            });

            console.log(`[${tenantId}] User: ${message}`);
            console.log(`[${tenantId}] AI: ${aiResponse.response.substring(0, 100)}...`);

          } catch (error) {
            console.error('Socket chat error:', error);
            
            // Send error response
            socket.emit('ai-response', {
              id: generateMessageId(),
              content: 'I apologize, but I\'m experiencing technical difficulties. Please try again in a moment.',
              sender: 'ai',
              senderType: 'bot',
              sentAt: new Date().toISOString(),
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
        socket.on('typing', (data) => {
          socket.to(`tenant:${data.tenantId}`).emit('typing', {
            isTyping: data.isTyping,
            sender: 'user',
            socketId: socket.id
          });
        });

        // Handle contact form submission
        socket.on('submit-contact', async (data) => {
          try {
            const { contactInfo, tenantId } = data;
            
            socket.emit('contact-submitted', {
              success: true,
              message: 'Thank you! Your information has been received. We will contact you shortly to schedule your consultation.'
            });

            // Send follow-up AI message
            socket.emit('ai-response', {
              id: generateMessageId(),
              content: 'Perfect! I\'ve received your contact information. Our team will reach out within the next business day to schedule your consultation. Is there anything else I can help you with in the meantime?',
              sender: 'ai',
              senderType: 'bot',
              sentAt: new Date().toISOString(),
              tenantId,
              metadata: {
                intent: 'consultation_scheduled',
                shouldOfferConsultation: false,
                isDataCollection: false,
                tenantId
              }
            });

            console.log(`[${tenantId}] Contact form submitted:`, contactInfo);

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

      console.log('Socket.IO server initialized');
    }
  };
}

function generateMessageId() {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}