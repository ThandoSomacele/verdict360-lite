const axios = require('axios');
const { getDatabase } = require('../config/db');
const logger = require('../utils/logger');

class AIService {
  constructor() {
    this.ollamaBaseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.model = process.env.AI_MODEL || 'llama3.1:8b';
    this.maxTokens = parseInt(process.env.AI_MAX_TOKENS) || 1000;
    this.temperature = parseFloat(process.env.AI_TEMPERATURE) || 0.7;
  }

  /**
   * Generate AI response for a given message and context
   */
  async generateResponse(message, context = {}) {
    try {
      const { tenantId, conversationHistory = [], userMessage } = context;
      
      // Get tenant-specific context
      const tenantContext = await this.getTenantContext(tenantId);
      
      // Build the prompt with South African legal context
      const systemPrompt = this.buildSystemPrompt(tenantContext);
      const conversationPrompt = this.buildConversationPrompt(conversationHistory, userMessage);
      
      // Call Ollama API
      const response = await this.callOllamaAPI(systemPrompt, conversationPrompt);
      
      // Process response and determine next action
      const processedResponse = this.processResponse(response, context);
      
      logger.info(`AI response generated for tenant ${tenantId}`);
      return processedResponse;
      
    } catch (error) {
      logger.error('Error generating AI response:', error);
      return this.getFallbackResponse();
    }
  }

  /**
   * Get tenant-specific context for personalized responses
   */
  async getTenantContext(tenantId) {
    try {
      const db = getDatabase();
      
      const tenant = await db('tenants')
        .where({ id: tenantId })
        .select(['name', 'branding', 'settings'])
        .first();

      if (!tenant) {
        throw new Error('Tenant not found');
      }

      const branding = typeof tenant.branding === 'string' 
        ? JSON.parse(tenant.branding) 
        : tenant.branding || {};
        
      const settings = typeof tenant.settings === 'string' 
        ? JSON.parse(tenant.settings) 
        : tenant.settings || {};

      return {
        firmName: tenant.name,
        companyName: branding.companyName || tenant.name,
        welcomeMessage: branding.welcomeMessage,
        practiceAreas: settings.practiceAreas || [],
        businessHours: settings.businessHours || {}
      };
    } catch (error) {
      logger.error('Error getting tenant context:', error);
      return {
        firmName: 'Our Law Firm',
        companyName: 'Our Law Firm',
        practiceAreas: ['General Legal Services'],
        businessHours: {}
      };
    }
  }

  /**
   * Build the system prompt with South African legal context
   */
  buildSystemPrompt(tenantContext) {
    return `You are a helpful legal assistant chatbot for ${tenantContext.companyName}, a law firm in South Africa. Your role is to:

1. SCOPE: Only provide information about South African law - never international legal advice
2. PURPOSE: Help website visitors with basic legal questions and guide them to book consultations
3. TONE: Professional but approachable, concise and helpful
4. GOAL: Convert visitors to consultation bookings efficiently

PRACTICE AREAS: ${tenantContext.practiceAreas.join(', ')}

IMPORTANT LIMITATIONS:
- Always clarify you provide general legal information, not legal advice
- For complex issues, say "This is possible and can be done like this..." then offer consultation
- Never give specific legal advice or guarantee outcomes
- Always recommend consulting with an attorney for specific situations
- Keep responses under 150 words

CONVERSATION FLOW:
1. Answer basic legal questions within South African context
2. For complex issues, provide brief overview then offer consultation
3. If user shows interest, ask: "Would you like me to connect you with an attorney who can better assist you?"
4. If yes, say: "Can I assist with setting up a meeting for a free consultation?"
5. Collect: Name, Surname, Email, Phone Number
6. Confirm booking: "We've booked that time slot, you'll hear from one of our attorneys soon"

SOUTH AFRICAN LEGAL CONTEXT:
- Reference relevant SA laws (e.g., Labour Relations Act, Companies Act, Consumer Protection Act)
- Mention institutions like CCMA, CIPC, High Court, Magistrate's Court when relevant
- Use SA legal terminology and procedures
- Consider POPIA (Protection of Personal Information Act) for privacy matters

Remember: Your goal is to be helpful while guiding users toward booking consultations with qualified attorneys.`;
  }

  /**
   * Build conversation prompt from history
   */
  buildConversationPrompt(conversationHistory, currentMessage) {
    let prompt = '';
    
    // Add recent conversation history (last 10 messages)
    const recentHistory = conversationHistory.slice(-10);
    
    recentHistory.forEach(msg => {
      if (msg.senderType === 'visitor') {
        prompt += `User: ${msg.content}\n`;
      } else if (msg.senderType === 'bot') {
        prompt += `Assistant: ${msg.content}\n`;
      }
    });
    
    // Add current message
    prompt += `User: ${currentMessage}\nAssistant:`;
    
    return prompt;
  }

  /**
   * Call Ollama API
   */
  async callOllamaAPI(systemPrompt, conversationPrompt) {
    try {
      const response = await axios.post(`${this.ollamaBaseUrl}/api/generate`, {
        model: this.model,
        prompt: `${systemPrompt}\n\n${conversationPrompt}`,
        stream: false,
        options: {
          temperature: this.temperature,
          num_predict: this.maxTokens,
          top_p: 0.9,
          repeat_penalty: 1.1
        }
      }, {
        timeout: 30000, // 30 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data.response;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        logger.error('Ollama service is not running. Please start Ollama first.');
        throw new Error('AI service unavailable');
      } else if (error.response?.status === 404) {
        logger.error(`Model ${this.model} not found. Please pull the model first: ollama pull ${this.model}`);
        throw new Error('AI model not available');
      }
      throw error;
    }
  }

  /**
   * Process AI response and determine next actions
   */
  processResponse(response, context) {
    // Clean up the response
    const cleanedResponse = response.trim();
    
    // Analyze response for conversation flow triggers
    const analysis = this.analyzeResponse(cleanedResponse, context);
    
    return {
      content: cleanedResponse,
      metadata: {
        intent: analysis.intent,
        shouldOfferConsultation: analysis.shouldOfferConsultation,
        isDataCollection: analysis.isDataCollection,
        confidenceScore: analysis.confidenceScore,
        suggestedActions: analysis.suggestedActions
      }
    };
  }

  /**
   * Analyze response to determine conversation flow
   */
  analyzeResponse(response, context) {
    const lowerResponse = response.toLowerCase();
    
    // Keywords that suggest consultation should be offered
    const consultationTriggers = [
      'complex', 'specific', 'detailed', 'consult', 'attorney', 'lawyer',
      'depends on', 'case by case', 'recommend speaking', 'should discuss'
    ];
    
    // Keywords that suggest data collection phase
    const dataCollectionTriggers = [
      'name', 'email', 'phone', 'contact', 'details', 'information'
    ];
    
    const shouldOfferConsultation = consultationTriggers.some(trigger => 
      lowerResponse.includes(trigger)
    );
    
    const isDataCollection = dataCollectionTriggers.some(trigger => 
      lowerResponse.includes(trigger)
    );
    
    // Determine intent
    let intent = 'general_inquiry';
    if (isDataCollection) {
      intent = 'data_collection';
    } else if (shouldOfferConsultation) {
      intent = 'consultation_offer';
    } else if (lowerResponse.includes('book') || lowerResponse.includes('appointment')) {
      intent = 'booking_request';
    }
    
    return {
      intent,
      shouldOfferConsultation,
      isDataCollection,
      confidenceScore: 0.8, // Could be improved with ML models
      suggestedActions: this.getSuggestedActions(intent, context)
    };
  }

  /**
   * Get suggested actions based on intent
   */
  getSuggestedActions(intent, context) {
    const actions = [];
    
    switch (intent) {
      case 'consultation_offer':
        actions.push('offer_consultation');
        break;
      case 'booking_request':
        actions.push('collect_contact_info');
        break;
      case 'data_collection':
        actions.push('validate_contact_info', 'schedule_consultation');
        break;
      default:
        actions.push('continue_conversation');
    }
    
    return actions;
  }

  /**
   * Get fallback response when AI service fails
   */
  getFallbackResponse() {
    const fallbackResponses = [
      "I apologize, but I'm experiencing technical difficulties at the moment. However, I'd be happy to connect you with one of our attorneys who can assist you. Would you like me to arrange a consultation?",
      "I'm having trouble processing your request right now. Let me connect you with a qualified attorney who can provide the legal guidance you need. Shall I set up a consultation for you?",
      "Our AI assistant is temporarily unavailable, but our legal team is ready to help. Would you like to speak with an attorney about your legal matter?"
    ];
    
    const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
    
    return {
      content: fallbackResponses[randomIndex],
      metadata: {
        intent: 'fallback',
        shouldOfferConsultation: true,
        isDataCollection: false,
        confidenceScore: 1.0,
        suggestedActions: ['offer_consultation']
      }
    };
  }

  /**
   * Generate welcome message for new conversations
   */
  async generateWelcomeMessage(tenantId) {
    try {
      const tenantContext = await this.getTenantContext(tenantId);
      
      // Use custom welcome message if available
      if (tenantContext.welcomeMessage) {
        return {
          content: tenantContext.welcomeMessage,
          metadata: {
            intent: 'greeting',
            shouldOfferConsultation: false,
            isDataCollection: false,
            confidenceScore: 1.0,
            suggestedActions: ['continue_conversation']
          }
        };
      }
      
      // Generate dynamic welcome message
      const practiceAreasText = tenantContext.practiceAreas.length > 0 
        ? ` We specialize in ${tenantContext.practiceAreas.slice(0, 3).join(', ')}.`
        : '';
      
      const welcomeContent = `Hello! Welcome to ${tenantContext.companyName}.${practiceAreasText} I'm here to help answer your legal questions and connect you with our experienced attorneys. How can I assist you today?`;
      
      return {
        content: welcomeContent,
        metadata: {
          intent: 'greeting',
          shouldOfferConsultation: false,
          isDataCollection: false,
          confidenceScore: 1.0,
          suggestedActions: ['continue_conversation']
        }
      };
    } catch (error) {
      logger.error('Error generating welcome message:', error);
      return {
        content: "Hello! Welcome to our law firm. I'm here to help answer your legal questions and connect you with our attorneys. How can I assist you today?",
        metadata: {
          intent: 'greeting',
          shouldOfferConsultation: false,
          isDataCollection: false,
          confidenceScore: 1.0,
          suggestedActions: ['continue_conversation']
        }
      };
    }
  }

  /**
   * Check if Ollama service is available
   */
  async checkOllamaHealth() {
    try {
      const response = await axios.get(`${this.ollamaBaseUrl}/api/tags`, {
        timeout: 5000
      });
      
      const hasModel = response.data.models?.some(model => 
        model.name.includes(this.model.split(':')[0])
      );
      
      return {
        available: true,
        modelExists: hasModel,
        models: response.data.models?.map(m => m.name) || []
      };
    } catch (error) {
      return {
        available: false,
        modelExists: false,
        error: error.message
      };
    }
  }
}

module.exports = new AIService();