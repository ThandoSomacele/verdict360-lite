import axios from 'axios';

const OLLAMA_BASE_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.AI_MODEL || 'llama3.2:latest';

const SYSTEM_PROMPT = `You are a helpful AI assistant specializing in South African law. You provide accurate, informative responses about legal matters in South Africa. When clients ask about specific legal issues, provide general guidance but always recommend consulting with a qualified attorney for personalized advice.

Key guidelines:
1. Focus on South African law and regulations
2. Provide clear, accessible explanations
3. Always recommend professional legal consultation for specific cases
4. Be empathetic and professional
5. If you detect the client needs consultation, offer to connect them with an attorney

When you believe a consultation would be beneficial, respond with: "I'd recommend scheduling a consultation to discuss this matter in detail. Would you like me to help arrange that?"`;

export class AIService {
  constructor() {
    this.model = DEFAULT_MODEL;
    this.baseUrl = OLLAMA_BASE_URL;
  }

  async generateWelcomeMessage(tenantId = 'demo') {
    return {
      response: "Good day! I'm your AI legal assistant, here to help with South African legal enquiries. How may I assist you today?",
      metadata: {
        intent: 'greeting',
        shouldOfferConsultation: false,
        isDataCollection: false,
        tenantId,
        timestamp: new Date().toISOString()
      }
    };
  }

  async generateResponse(message, conversationHistory = [], tenantId = 'demo') {
    try {
      // Build conversation context
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...conversationHistory.slice(-10).map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: 'user', content: message }
      ];

      const request = {
        model: this.model,
        messages,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 1000
        }
      };

      console.log('Sending request to Ollama:', this.baseUrl + '/api/chat');
      console.log('Using model:', this.model);
      
      const response = await axios.post(`${this.baseUrl}/api/chat`, request);
      const aiResponse = response.data.message?.content || 'I apologize, but I encountered an error processing your request.';

      // Analyze response for intent and metadata
      const metadata = this.analyzeResponse(aiResponse, message);

      return {
        response: aiResponse,
        metadata: {
          ...metadata,
          tenantId,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('AI Service Error:', error.message);
      console.error('Full error:', error);
      
      return {
        response: 'I apologize, but I\'m experiencing technical difficulties. Please try again in a moment.',
        metadata: {
          intent: 'error',
          shouldOfferConsultation: false,
          isDataCollection: false,
          tenantId,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  analyzeResponse(response, userMessage) {
    const lowerResponse = response.toLowerCase();
    const lowerMessage = userMessage.toLowerCase();
    
    // Check if response suggests consultation
    const consultationKeywords = [
      'consultation',
      'schedule',
      'attorney',
      'lawyer',
      'legal advice',
      'would you like me to help arrange'
    ];
    
    const shouldOfferConsultation = consultationKeywords.some(keyword => 
      lowerResponse.includes(keyword)
    );
    
    // Check if it's a data collection step
    const isDataCollection = lowerResponse.includes('contact information') ||
                           lowerResponse.includes('email') ||
                           lowerResponse.includes('phone number');
    
    // Determine intent
    let intent = 'general_query';
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      intent = 'greeting';
    } else if (lowerMessage.includes('thank') || lowerMessage.includes('bye')) {
      intent = 'closing';
    } else if (shouldOfferConsultation) {
      intent = 'consultation_offer';
    } else if (isDataCollection) {
      intent = 'data_collection';
    }
    
    return {
      intent,
      shouldOfferConsultation,
      isDataCollection
    };
  }
}