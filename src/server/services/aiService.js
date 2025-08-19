const axios = require('axios');
const { getDatabase } = require('../config/db');
const logger = require('../utils/logger');
const calendarService = require('./calendarService');
const emailService = require('./emailService');

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
    return `You are a helpful and empathetic legal assistant for ${tenantContext.companyName}, a South African law firm. 

PERSONALITY:
- Friendly, professional, and genuinely caring
- Use natural conversational language, not robotic phrases
- Show empathy for personal/family legal matters
- Be concise but thorough (under 100 words typically)

YOUR EXPERTISE:
- South African law and legal procedures
- Practice areas: ${tenantContext.practiceAreas.join(', ')}
- Can explain general legal concepts and processes
- Know relevant laws: Divorce Act, Labour Relations Act, Consumer Protection Act, etc.

CONVERSATION FLOW:
1. Listen to what the user needs
2. Provide helpful, practical information about SA law
3. If it's complex or they need specific advice, naturally offer to connect them with an attorney
4. If they want consultation, collect: name, email, phone

IMPORTANT BOUNDARIES:
- Give general legal information, not specific legal advice
- Always clarify this is general guidance, not legal advice
- For complex personal situations, empathetically suggest speaking with an attorney
- Don't be pushy about consultations - be helpful first

HANDLING USER INPUT:
- Use context to understand misspelled words or typos intelligently
- If unclear what user meant, politely ask for clarification: "I think you might be asking about [X]. Is that correct, or did you mean something else?"
- Be understanding of common typos and spelling errors - interpret meaning from context
- Don't ignore or dismiss unclear messages - engage helpfully

TONE: Conversational, empathetic, knowledgeable. Talk like a caring professional who genuinely wants to help.

LANGUAGE: Use British English spelling (e.g., personalised, specialised, realise, analyse, colour, centre) as appropriate for South African context.`;
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
    
    // Check if this is a greeting response (should not trigger consultation)
    const greetingIndicators = [
      'hello', 'hi', 'welcome', 'good morning', 'good afternoon', 'how can i help'
    ];
    const isGreetingResponse = greetingIndicators.some(indicator => 
      lowerResponse.includes(indicator)
    );
    
    // Very explicit consultation triggers only
    const strongConsultationTriggers = [
      'connect you with one of our attorneys', 'connect you with an attorney',
      'set up a consultation', 'arrange a consultation',
      'schedule a consultation', 'book a consultation'
    ];
    
    // Very explicit data collection triggers only
    const explicitDataCollectionTriggers = [
      'provide your full name', 'need your contact information', 
      'provide your name, email', 'collect some basic contact information',
      'need to collect', 'your full name, email address, and phone number'
    ];
    
    const hasStrongConsultationTrigger = strongConsultationTriggers.some(trigger => 
      lowerResponse.includes(trigger)
    );
    
    const hasExplicitDataCollection = explicitDataCollectionTriggers.some(trigger => 
      lowerResponse.includes(trigger)
    );
    
    // Don't trigger consultation/data collection for greeting responses
    const shouldOfferConsultation = !isGreetingResponse && hasStrongConsultationTrigger;
    const isDataCollection = !isGreetingResponse && hasExplicitDataCollection;
    
    // Determine intent
    let intent = 'general_inquiry';
    if (isGreetingResponse) {
      intent = 'greeting';
    } else if (isDataCollection) {
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
      confidenceScore: 0.8,
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
      "I apologise, but we're experiencing technical difficulties at the moment. However, I'd be happy to connect you with one of our attorneys who can assist you. Would you like me to arrange a consultation?",
      "I'm having trouble processing your request right now. Let me connect you with a qualified attorney who can provide the legal guidance you need. Shall I set up a consultation for you?"
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
        ? ` We specialise in ${tenantContext.practiceAreas.slice(0, 3).join(', ')}.`
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
        content: "Good day! Welcome to our law firm. I'm here to assist you with your legal enquiries and connect you with our qualified attorneys. How may I help you today?",
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
   * Handle calendar appointment booking from chatbot conversation
   */
  async handleAppointmentBooking(tenantId, leadData, requestedSlot = null) {
    try {
      const { firstName, lastName, email, phone, legalIssue } = leadData;
      
      // Check if calendar is connected
      const isCalendarConnected = await calendarService.isCalendarConnected(tenantId);
      
      if (!isCalendarConnected) {
        logger.warn(`Calendar not connected for tenant ${tenantId}, creating lead without appointment`);
        return {
          success: false,
          message: 'Calendar integration not available. We will contact you to schedule your consultation.',
          requiresManualScheduling: true
        };
      }
      
      let appointmentTime = requestedSlot;
      
      // If no specific time requested, suggest next available slot
      if (!appointmentTime) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const availableSlots = await calendarService.getAvailableSlots(tenantId, tomorrow, 60);
        
        if (availableSlots.length > 0) {
          appointmentTime = availableSlots[0].start;
        } else {
          return {
            success: false,
            message: 'No available appointments tomorrow. We will contact you to find a suitable time.',
            requiresManualScheduling: true
          };
        }
      }
      
      // Create the appointment
      const appointmentData = {
        clientName: `${firstName} ${lastName}`,
        clientEmail: email,
        clientPhone: phone,
        legalIssue: legalIssue,
        startTime: appointmentTime,
        duration: 60, // 1 hour consultation
        notes: 'Booked via AI chatbot'
      };
      
      const appointment = await calendarService.createConsultationAppointment(
        tenantId, 
        appointmentData
      );
      
      // Send confirmation email
      await emailService.sendConsultationConfirmation(
        leadData,
        await this.getTenantDetails(tenantId),
        {
          appointmentTime: appointmentTime,
          meetingLink: appointment.meetingLink,
          duration: 60
        }
      );
      
      logger.info(`Appointment automatically booked: ${appointment.appointmentId} for tenant ${tenantId}`);
      
      return {
        success: true,
        appointment: {
          id: appointment.appointmentId,
          startTime: appointment.startTime,
          endTime: appointment.endTime,
          meetingLink: appointment.meetingLink,
          calendarUrl: appointment.calendarUrl
        },
        message: `Great! I've scheduled your consultation for ${appointmentTime.toLocaleDateString('en-ZA')} at ${appointmentTime.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}. You'll receive a calendar invitation and confirmation email shortly.`
      };
      
    } catch (error) {
      logger.error('Error handling appointment booking:', error);
      return {
        success: false,
        message: 'I encountered an issue scheduling your appointment, but we have your details and will contact you soon to arrange a consultation.',
        requiresManualScheduling: true
      };
    }
  }
  
  /**
   * Get available appointment slots for chatbot responses
   */
  async getAvailableAppointmentSlots(tenantId, preferredDate = null) {
    try {
      const isCalendarConnected = await calendarService.isCalendarConnected(tenantId);
      
      if (!isCalendarConnected) {
        return {
          available: false,
          message: 'Calendar scheduling is not available. We will contact you to arrange a consultation.'
        };
      }
      
      const targetDate = preferredDate || (() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
      })();
      
      const slots = await calendarService.getAvailableSlots(tenantId, targetDate, 60);
      
      if (slots.length === 0) {
        return {
          available: false,
          message: 'No appointments available for that date. We will contact you to find a suitable time.'
        };
      }
      
      // Format slots for chatbot response
      const formattedSlots = slots.slice(0, 3).map((slot, index) => ({
        id: index + 1,
        time: slot.start.toLocaleTimeString('en-ZA', { 
          hour: '2-digit', 
          minute: '2-digit',
          timeZone: 'Africa/Johannesburg'
        }),
        datetime: slot.start,
        available: slot.available
      }));
      
      return {
        available: true,
        date: targetDate.toLocaleDateString('en-ZA'),
        slots: formattedSlots,
        message: `Here are the available consultation times for ${targetDate.toLocaleDateString('en-ZA')}:`
      };
      
    } catch (error) {
      logger.error('Error getting available slots:', error);
      return {
        available: false,
        message: 'Unable to check appointment availability. We will contact you to schedule a consultation.'
      };
    }
  }
  
  /**
   * Enhanced response processing with calendar integration
   */
  processResponseWithCalendar(response, context, leadData = null) {
    const processedResponse = this.processResponse(response, context);
    
    // Check if we should offer specific appointment times
    if (processedResponse.metadata.intent === 'booking_request' && leadData) {
      processedResponse.metadata.suggestedActions.push('show_available_slots');
      processedResponse.metadata.leadData = leadData;
    }
    
    return processedResponse;
  }
  
  /**
   * Get tenant details for appointments
   */
  async getTenantDetails(tenantId) {
    try {
      const db = getDatabase();
      const tenant = await db('tenants').where({ id: tenantId }).first();
      return tenant;
    } catch (error) {
      logger.error('Error getting tenant details:', error);
      return null;
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
