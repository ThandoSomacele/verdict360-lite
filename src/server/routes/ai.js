const express = require('express');
const { body, validationResult } = require('express-validator');
const { optionalAuth } = require('../middleware/auth');
const { chatRateLimit } = require('../middleware/rateLimit');
const { asyncHandler } = require('../middleware/errorHandler');
const aiService = require('../services/aiService');
const conversationFlow = require('../services/conversationFlow');
const logger = require('../utils/logger');

const router = express.Router();

// Generate AI response for conversation
router.post('/chat',
  chatRateLimit,
  [
    body('message').trim().isLength({ min: 1, max: 2000 }).withMessage('Message required (max 2000 chars)'),
    body('conversationId').isUUID().withMessage('Valid conversation ID required'),
    body('visitorId').optional().trim()
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message, conversationId, visitorId } = req.body;
    
    try {
      // Process the message through conversation flow
      const aiResponse = await conversationFlow.processUserMessage(
        conversationId, 
        message, 
        req.tenant.id
      );

      // Send bot response via Socket.IO if available
      const chatSocket = req.app.get('chatSocket');
      if (chatSocket) {
        await chatSocket.sendBotMessage(conversationId, aiResponse.content, aiResponse.metadata);
      }

      res.json({
        response: aiResponse.content,
        metadata: aiResponse.metadata,
        conversationId,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Error processing chat message:', error);
      
      // Return fallback response
      const fallbackResponse = aiService.getFallbackResponse();
      res.json({
        response: fallbackResponse.content,
        metadata: fallbackResponse.metadata,
        conversationId,
        timestamp: new Date().toISOString(),
        error: 'AI service temporarily unavailable'
      });
    }
  })
);

// Generate welcome message for new conversation
router.post('/welcome',
  chatRateLimit,
  asyncHandler(async (req, res) => {
    try {
      const welcomeMessage = await conversationFlow.generateWelcomeMessage(req.tenant.id);
      
      res.json({
        response: welcomeMessage.content,
        metadata: welcomeMessage.metadata,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Error generating welcome message:', error);
      
      res.json({
        response: "Hello! Welcome to our law firm. I'm here to help answer your legal questions and connect you with our attorneys. How can I assist you today?",
        metadata: {
          intent: 'greeting',
          shouldOfferConsultation: false,
          isDataCollection: false
        },
        timestamp: new Date().toISOString()
      });
    }
  })
);

// Health check for AI services
router.get('/health',
  optionalAuth,
  asyncHandler(async (req, res) => {
    try {
      const ollamaHealth = await aiService.checkOllamaHealth();
      
      res.json({
        status: 'healthy',
        services: {
          ollama: {
            available: ollamaHealth.available,
            modelExists: ollamaHealth.modelExists,
            models: ollamaHealth.models,
            error: ollamaHealth.error
          },
          conversationFlow: {
            available: true
          }
        },
        configuration: {
          model: process.env.AI_MODEL || 'llama3.1:8b',
          maxTokens: parseInt(process.env.AI_MAX_TOKENS) || 1000,
          temperature: parseFloat(process.env.AI_TEMPERATURE) || 0.7
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Error checking AI health:', error);
      
      res.status(503).json({
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  })
);

// Test AI response (for development/testing)
router.post('/test',
  optionalAuth,
  [
    body('message').trim().isLength({ min: 1, max: 1000 }).withMessage('Test message required'),
    body('tenantId').optional().isUUID()
  ],
  asyncHandler(async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json({ error: 'Not found' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message, tenantId } = req.body;
    const testTenantId = tenantId || req.tenant?.id || 'dddddddd-dddd-dddd-dddd-dddddddddddd';

    try {
      const response = await aiService.generateResponse(message, {
        tenantId: testTenantId,
        conversationHistory: [],
        userMessage: message
      });

      res.json({
        input: message,
        response: response.content,
        metadata: response.metadata,
        tenantId: testTenantId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Error in AI test:', error);
      
      res.status(500).json({
        error: 'AI test failed',
        details: error.message,
        timestamp: new Date().toISOString()
      });
    }
  })
);

// Get conversation analysis (for attorneys)
router.get('/conversations/:conversationId/analysis',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    
    try {
      const conversation = await conversationFlow.getConversationWithHistory(conversationId);
      const currentState = conversationFlow.determineConversationState(conversation);
      
      // Analyze conversation for insights
      const analysis = {
        conversationId,
        state: currentState,
        messageCount: conversation.messages.length,
        visitorMessages: conversation.messages.filter(m => m.sender_type === 'visitor').length,
        botMessages: conversation.messages.filter(m => m.sender_type === 'bot').length,
        duration: conversation.ended_at ? 
          new Date(conversation.ended_at) - new Date(conversation.started_at) : 
          new Date() - new Date(conversation.started_at),
        leadCreated: !!conversation.lead_id,
        topics: extractTopics(conversation.messages),
        sentiment: analyzeSentiment(conversation.messages)
      };
      
      res.json(analysis);
    } catch (error) {
      logger.error('Error analyzing conversation:', error);
      res.status(500).json({ error: 'Analysis failed' });
    }
  })
);

// Helper function to extract topics from conversation
function extractTopics(messages) {
  const legalTopics = {
    'criminal': ['arrest', 'charge', 'criminal', 'theft', 'assault', 'bail'],
    'family': ['divorce', 'custody', 'maintenance', 'adoption', 'marriage'],
    'property': ['property', 'transfer', 'deed', 'house', 'land', 'estate'],
    'labour': ['employer', 'workplace', 'discrimination', 'dismissal', 'ccma'],
    'commercial': ['business', 'company', 'contract', 'commercial', 'trade'],
    'immigration': ['visa', 'permit', 'immigration', 'refugee', 'citizenship']
  };
  
  const userMessages = messages
    .filter(m => m.sender_type === 'visitor')
    .map(m => m.content.toLowerCase())
    .join(' ');
  
  const detectedTopics = [];
  
  Object.entries(legalTopics).forEach(([topic, keywords]) => {
    const matches = keywords.filter(keyword => userMessages.includes(keyword));
    if (matches.length > 0) {
      detectedTopics.push({
        topic,
        confidence: matches.length / keywords.length,
        keywords: matches
      });
    }
  });
  
  return detectedTopics.sort((a, b) => b.confidence - a.confidence);
}

// Helper function to analyze sentiment
function analyzeSentiment(messages) {
  const positiveWords = ['thank', 'great', 'helpful', 'good', 'appreciate', 'excellent'];
  const negativeWords = ['frustrated', 'angry', 'upset', 'terrible', 'awful', 'worried'];
  const urgentWords = ['urgent', 'emergency', 'asap', 'immediately', 'help'];
  
  const userText = messages
    .filter(m => m.sender_type === 'visitor')
    .map(m => m.content.toLowerCase())
    .join(' ');
  
  const positiveCount = positiveWords.filter(word => userText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => userText.includes(word)).length;
  const urgentCount = urgentWords.filter(word => userText.includes(word)).length;
  
  let sentiment = 'neutral';
  if (positiveCount > negativeCount) sentiment = 'positive';
  if (negativeCount > positiveCount) sentiment = 'negative';
  if (urgentCount > 0) sentiment = 'urgent';
  
  return {
    sentiment,
    scores: {
      positive: positiveCount,
      negative: negativeCount,
      urgent: urgentCount
    }
  };
}

module.exports = router;