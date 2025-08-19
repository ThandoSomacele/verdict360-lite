const aiService = require('./aiService');
const { getDatabase } = require('../config/db');
const logger = require('../utils/logger');

class ConversationFlowService {
  constructor() {
    this.flowStates = {
      INITIAL: 'initial',
      GATHERING_INFO: 'gathering_info',
      OFFERING_CONSULTATION: 'offering_consultation',
      COLLECTING_CONTACT: 'collecting_contact',
      SCHEDULING: 'scheduling',
      COMPLETED: 'completed',
    };
  }

  /**
   * Process a user message and return appropriate AI response
   */
  async processUserMessage(conversationId, userMessage, tenantId) {
    try {
      // Get conversation state and history
      const conversation = await this.getConversationWithHistory(conversationId);
      const currentState = this.determineConversationState(conversation);

      logger.info(`Processing message in state: ${currentState} for conversation ${conversationId}`);

      // Handle different conversation states
      switch (currentState) {
        case this.flowStates.INITIAL:
          return await this.handleInitialState(conversation, userMessage, tenantId);

        case this.flowStates.GATHERING_INFO:
          return await this.handleGatheringInfoState(conversation, userMessage, tenantId);

        case this.flowStates.OFFERING_CONSULTATION:
          return await this.handleOfferingConsultationState(conversation, userMessage, tenantId);

        case this.flowStates.COLLECTING_CONTACT:
          return await this.handleCollectingContactState(conversation, userMessage, tenantId);

        case this.flowStates.SCHEDULING:
          return await this.handleSchedulingState(conversation, userMessage, tenantId);

        case this.flowStates.COMPLETED:
          return await this.handleCompletedState(conversation, userMessage, tenantId);

        default:
          return await this.handleGatheringInfoState(conversation, userMessage, tenantId);
      }
    } catch (error) {
      logger.error('Error processing user message:', error);
      return aiService.getFallbackResponse();
    }
  }

  /**
   * Get conversation with message history
   */
  async getConversationWithHistory(conversationId) {
    const db = getDatabase();

    const conversation = await db('conversations').where({ id: conversationId }).first();

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const messages = await db('messages')
      .where({ conversation_id: conversationId })
      .orderBy('sent_at', 'asc')
      .select(['sender_type', 'content', 'metadata', 'sent_at']);

    return {
      ...conversation,
      messages,
    };
  }

  /**
   * Determine current conversation state based on history
   */
  determineConversationState(conversation) {
    const { messages } = conversation;

    if (messages.length === 0) {
      return this.flowStates.INITIAL;
    }

    // Check if consultation has been confirmed (lead created)
    const hasLeadConfirmation = messages.some(
      msg =>
        msg.sender_type === 'bot' &&
        (msg.content.includes('consultation request has already been submitted') ||
          msg.content.includes('have all your information and have created') ||
          msg.content.includes('consultation request. One of our'))
    );

    if (hasLeadConfirmation) {
      return this.flowStates.COMPLETED;
    }

    // Look for consultation-related keywords in recent messages
    const recentMessages = messages.slice(-5);

    // Check if we're collecting contact information (explicit data collection)
    const hasContactRequest = recentMessages.some(
      msg =>
        msg.sender_type === 'bot' &&
        (msg.content.toLowerCase().includes('contact information') ||
          msg.content.toLowerCase().includes('provide your name') ||
          msg.content.toLowerCase().includes('your email') ||
          msg.content.toLowerCase().includes('your phone number') ||
          msg.content.toLowerCase().includes('collect your details'))
    );

    if (hasContactRequest) {
      return this.flowStates.COLLECTING_CONTACT;
    }

    // Check if consultation was offered
    const hasConsultationOffer = recentMessages.some(
      msg =>
        msg.sender_type === 'bot' &&
        (msg.content.toLowerCase().includes('consultation') ||
          msg.content.toLowerCase().includes('attorney') ||
          msg.content.toLowerCase().includes('meeting'))
    );

    if (hasConsultationOffer) {
      return this.flowStates.OFFERING_CONSULTATION;
    }

    return this.flowStates.GATHERING_INFO;
  }

  /**
   * Handle initial conversation state (welcome)
   */
  async handleInitialState(conversation, userMessage, tenantId) {
    const context = {
      tenantId,
      conversationHistory: [],
      userMessage,
    };

    return await aiService.generateResponse(userMessage, context);
  }

  /**
   * Handle information gathering state
   */
  async handleGatheringInfoState(conversation, userMessage, tenantId) {
    const context = {
      tenantId,
      conversationHistory: conversation.messages,
      userMessage,
    };

    const response = await aiService.generateResponse(userMessage, context);

    // Let the AI handle consultation timing naturally - no forced additions
    return response;
  }

  /**
   * Handle consultation offering state
   */
  async handleOfferingConsultationState(conversation, userMessage, tenantId) {
    const userResponse = userMessage.toLowerCase().trim();

    // Check for positive responses
    const positiveResponses = [
      'yes',
      'yeah',
      'yep',
      'sure',
      'ok',
      'okay',
      'please',
      'that would be great',
      'connect me',
    ];
    const negativeResponses = ['no', 'nah', 'not now', 'maybe later', 'not interested', 'not yet'];

    const isPositive = positiveResponses.some(phrase => userResponse.includes(phrase));
    const isNegative = negativeResponses.some(phrase => userResponse.includes(phrase));

    // Check if user is asking a follow-up question or providing more information
    const questionIndicators = [
      'what',
      'how',
      'when',
      'where',
      'why',
      'can you',
      'should i',
      'do i',
      'will i',
      'i need',
      'i want',
      'i am',
      'help me',
      'tell me',
      'explain',
      '?',
    ];

    const isAsking = questionIndicators.some(indicator => userResponse.includes(indicator));

    if (isPositive) {
      return {
        content:
          "Excellent! I'd be happy to set up a consultation for you. To connect you with the right attorney, I'll need to collect some basic contact information. Could you please provide your full name, email address, and phone number?",
        metadata: {
          intent: 'data_collection',
          shouldOfferConsultation: false,
          isDataCollection: true,
          suggestedActions: ['collect_contact_info'],
        },
      };
    } else if (isNegative && !isAsking) {
      return {
        content:
          "That's perfectly fine! I'm here should you have any other legal enquiries or if you change your mind about speaking with one of our attorneys. Is there anything else I can assist you with today?",
        metadata: {
          intent: 'continue_conversation',
          shouldOfferConsultation: false,
          isDataCollection: false,
          suggestedActions: ['continue_conversation'],
        },
      };
    } else if (isAsking) {
      // User is asking a follow-up question - provide helpful information then offer consultation again
      const context = {
        tenantId,
        conversationHistory: conversation.messages,
        userMessage,
      };

      const response = await aiService.generateResponse(userMessage, context);

      // Only add consultation offer if AI hasn't already included one
      const hasConsultationOffer =
        response.content.toLowerCase().includes('consultation') ||
        response.content.toLowerCase().includes('connect you') ||
        response.content.toLowerCase().includes('attorney');

      if (!hasConsultationOffer) {
        response.content +=
          '\n\nWould you like me to connect you with one of our attorneys who can provide more detailed guidance specific to your situation?';
      }

      response.metadata.shouldOfferConsultation = true;
      response.metadata.intent = 'information_with_consultation_offer';

      return response;
    } else {
      // Unclear response, ask for clarification
      return {
        content:
          "I want to make sure I understand correctly. Would you like me to arrange a consultation with one of our attorneys? I'll help you accordingly.",
        metadata: {
          intent: 'clarification',
          shouldOfferConsultation: true,
          isDataCollection: false,
          suggestedActions: ['clarify_consultation'],
        },
      };
    }
  }

  /**
   * Handle contact information collection state
   */
  async handleCollectingContactState(conversation, userMessage, tenantId) {
    // First check if a lead has already been created for this conversation
    const db = getDatabase();
    const existingLead = await db('leads')
      .whereRaw('metadata::text LIKE ?', [`%"conversationId":"${conversation.id}"%`])
      .orWhere(function () {
        this.whereExists(function () {
          this.select('*')
            .from('conversations')
            .whereRaw('conversations.id = ? AND conversations.lead_id = leads.id', [conversation.id]);
        });
      })
      .first();

    if (existingLead) {
      // Lead already exists, conversation is complete
      return {
        content: `Thank you! Your consultation request has already been submitted. One of our attorneys will contact you within 24 hours. Is there anything else I can help you with today?`,
        metadata: {
          intent: 'consultation_already_confirmed',
          leadCreated: true,
          leadId: existingLead.id,
          shouldOfferConsultation: false,
          isDataCollection: false,
          suggestedActions: ['conversation_complete'],
        },
      };
    }

    // Check if user is asking a question instead of providing contact info
    const questionIndicators = [
      'what',
      'how',
      'can',
      'should',
      'will',
      'before that',
      'wait',
      'tell me',
      'explain',
      'help',
      '?',
    ];

    const isAsking = questionIndicators.some(indicator => userMessage.toLowerCase().includes(indicator));

    // If user is asking a question, respond normally instead of collecting data
    if (isAsking && !userMessage.toLowerCase().includes('@')) {
      const context = {
        tenantId,
        conversationHistory: conversation.messages,
        userMessage,
      };

      const response = await aiService.generateResponse(userMessage, context);

      // After answering, remind about consultation setup
      response.content += "\n\nWhen you're ready, I can still help set up that consultation with one of our attorneys.";
      response.metadata.shouldOfferConsultation = true;

      return response;
    }

    const contactInfo = this.extractContactInfo(userMessage);

    if (contactInfo.isComplete) {
      // Create lead with collected information
      try {
        const leadId = await this.createLead(conversation.id, contactInfo, tenantId);

        // Link lead to conversation
        const db = getDatabase();
        await db('conversations').where({ id: conversation.id }).update({ lead_id: leadId, updated_at: db.fn.now() });

        return {
          content: `Thank you, ${contactInfo.firstName}! I have all your information and have created your consultation request. One of our experienced attorneys will contact you within 24 hours to schedule your free consultation. You should also receive a confirmation email shortly. Is there anything else I can help you with today?`,
          metadata: {
            intent: 'consultation_confirmed',
            leadCreated: true,
            leadId: leadId,
            shouldOfferConsultation: false,
            isDataCollection: false,
            suggestedActions: ['conversation_complete'],
          },
        };
      } catch (error) {
        logger.error('Error creating lead:', error);
        return {
          content:
            'I apologise, but I encountered an issue while saving your information. Please try again, or feel free to call our office directly to schedule your consultation.',
          metadata: {
            intent: 'error_recovery',
            shouldOfferConsultation: true,
            isDataCollection: false,
            suggestedActions: ['retry_contact_collection'],
          },
        };
      }
    } else {
      // Request missing information
      const missingFields = this.getMissingContactFields(contactInfo);
      return {
        content: `I have some of your information, but I still need ${missingFields.join(
          ' and '
        )}. Could you please provide the missing details?`,
        metadata: {
          intent: 'incomplete_data',
          missingFields,
          shouldOfferConsultation: false,
          isDataCollection: true,
          suggestedActions: ['collect_missing_info'],
        },
      };
    }
  }

  /**
   * Handle scheduling state
   */
  async handleSchedulingState(conversation, userMessage, tenantId) {
    // This would integrate with calendar service
    // For now, return a generic response
    return {
      content:
        'Our calendar integration is being set up. In the meantime, one of our attorneys will contact you within 24 hours to schedule your consultation at a time that works for you.',
      metadata: {
        intent: 'scheduling_pending',
        shouldOfferConsultation: false,
        isDataCollection: false,
        suggestedActions: ['manual_scheduling'],
      },
    };
  }

  /**
   * Determine if consultation should be offered based on message analysis
   */
  shouldOfferConsultation(userMessage, messageHistory) {
    const complexityIndicators = [
      'my case',
      'my situation',
      'what should i do',
      'need legal help',
      'been charged',
      'facing court',
      'legal action',
      'dispute',
      'divorce',
      'custody',
      'arrested',
      'sued',
      'injured in accident',
      'employment issue',
      'contract dispute',
    ];

    const userLower = userMessage.toLowerCase();
    const hasComplexityIndicator = complexityIndicators.some(indicator => userLower.includes(indicator));

    // Only offer consultation after 4+ messages OR clear complexity indicators
    const userMessageCount = messageHistory.filter(msg => msg.sender_type === 'visitor').length;
    const hasOfferedConsultation = messageHistory.some(
      msg => msg.sender_type === 'bot' && msg.content.toLowerCase().includes('consultation')
    );

    // Don't offer consultation for simple greetings or basic questions
    const simpleGreetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon'];
    const isSimpleGreeting = simpleGreetings.some(greeting => userLower.trim() === greeting);

    if (isSimpleGreeting && userMessageCount <= 1) {
      return false;
    }

    return hasComplexityIndicator || (userMessageCount >= 4 && !hasOfferedConsultation);
  }

  /**
   * Extract contact information from user message
   */
  extractContactInfo(message) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /(?:\+27|0)[0-9\s-]{8,}/;
    const nameRegex = /(?:my name is|i'm|i am)\s+([a-zA-Z\s]+)/i;

    const email = message.match(emailRegex)?.[0];
    const phone = message.match(phoneRegex)?.[0];
    const nameMatch = message.match(nameRegex)?.[1];

    // Try to extract names from the message
    let firstName, lastName;

    if (nameMatch) {
      const nameParts = nameMatch.trim().split(/\s+/);
      firstName = nameParts[0];
      lastName = nameParts.slice(1).join(' ');
    } else {
      // Look for name patterns without "my name is"
      const words = message.split(/\s+/).filter(word => word.length > 1 && /^[A-Z][a-z]+$/.test(word));

      if (words.length >= 2) {
        firstName = words[0];
        lastName = words.slice(1).join(' ');
      } else if (words.length === 1) {
        firstName = words[0];
      }
    }

    return {
      firstName,
      lastName,
      email,
      phone,
      isComplete: firstName && lastName && email && phone,
    };
  }

  /**
   * Get list of missing contact fields
   */
  getMissingContactFields(contactInfo) {
    const missing = [];

    if (!contactInfo.firstName || !contactInfo.lastName) {
      missing.push('your full name');
    }
    if (!contactInfo.email) {
      missing.push('your email address');
    }
    if (!contactInfo.phone) {
      missing.push('your phone number');
    }

    return missing;
  }

  /**
   * Create a lead from conversation
   */
  async createLead(conversationId, contactInfo, tenantId) {
    const db = getDatabase();

    // Get conversation context for legal issue
    const conversation = await db('conversations').where({ id: conversationId }).first();

    const messages = await db('messages')
      .where({ conversation_id: conversationId, sender_type: 'visitor' })
      .orderBy('sent_at', 'asc');

    // Extract legal issue from user messages
    const legalIssue = messages
      .map(msg => msg.content)
      .join(' ')
      .substring(0, 500); // Limit length

    const [lead] = await db('leads')
      .insert({
        tenant_id: tenantId,
        first_name: contactInfo.firstName,
        last_name: contactInfo.lastName,
        email: contactInfo.email,
        phone: contactInfo.phone,
        legal_issue: legalIssue,
        status: 'new',
        priority: 'medium',
        metadata: JSON.stringify({
          source: 'chatbot',
          conversationId: conversationId,
          collectedAt: new Date().toISOString(),
        }),
      })
      .returning('id');

    logger.info(`Lead created: ${lead.id} for tenant ${tenantId}`);
    return lead.id;
  }

  /**
   * Handle completed consultation state
   */
  async handleCompletedState(conversation, userMessage, tenantId) {
    // Consultation is complete, just provide general assistance
    const context = {
      tenantId,
      conversationHistory: conversation.messages.slice(-3), // Keep some context
      userMessage,
      isConsultationComplete: true,
    };

    return await aiService.generateResponse(userMessage, context);
  }

  /**
   * Generate welcome message for new conversation
   */
  async generateWelcomeMessage(tenantId) {
    return await aiService.generateWelcomeMessage(tenantId);
  }
}

module.exports = new ConversationFlowService();
