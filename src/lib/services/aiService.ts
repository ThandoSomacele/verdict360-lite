import axios from 'axios';
import type { ChatMessage, AIResponse } from '$lib/types';

interface OllamaRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  stream: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
  };
}

const OLLAMA_BASE_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.AI_MODEL || 'llama3.1:8b';

const SYSTEM_PROMPT = `You are a helpful AI assistant specializing in South African law. You provide accurate, informative responses about legal matters in South Africa. When clients ask about specific legal issues, provide general guidance but always recommend consulting with a qualified attorney for personalized advice.

Key guidelines:
1. Focus on South African law and regulations
2. Provide clear, accessible explanations
3. Always recommend professional legal consultation for specific cases
4. Be empathetic and professional
5. If you detect the client needs consultation, offer to connect them with an attorney

When you believe a consultation would be beneficial, respond with: "I'd recommend scheduling a consultation to discuss this matter in detail. Would you like me to help arrange that?"`;

export class AIService {
  private model: string;
  private baseUrl: string;

  constructor() {
    this.model = DEFAULT_MODEL;
    this.baseUrl = OLLAMA_BASE_URL;
  }

  async generateResponse(
    message: string,
    conversationHistory: ChatMessage[] = [],
    tenantId: string = 'demo'
  ): Promise<AIResponse> {
    try {
      // Build conversation context
      const messages = [
        { role: 'system' as const, content: SYSTEM_PROMPT },
        ...conversationHistory.slice(-10).map(msg => ({
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content
        })),
        { role: 'user' as const, content: message }
      ];

      const request: OllamaRequest = {
        model: this.model,
        messages,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 1000
        }
      };

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
      console.error('AI Service Error:', error);
      
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

  private analyzeResponse(response: string, userMessage: string) {
    const lowerResponse = response.toLowerCase();
    const lowerMessage = userMessage.toLowerCase();

    // Check for consultation offer patterns
    const consultationPatterns = [
      'schedule a consultation',
      'arrange that',
      'speak with an attorney',
      'consult with a lawyer',
      'book a consultation'
    ];

    const shouldOfferConsultation = consultationPatterns.some(pattern => 
      lowerResponse.includes(pattern)
    );

    // Check for data collection triggers
    const dataCollectionTriggers = [
      'contact details',
      'personal information',
      'schedule a consultation',
      'arrange that',
      'book a consultation'
    ];

    const isDataCollection = dataCollectionTriggers.some(trigger => 
      lowerResponse.includes(trigger)
    );

    // Determine intent based on user message and AI response
    let intent = 'general_inquiry';
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('good')) {
      intent = 'greeting';
    } else if (shouldOfferConsultation) {
      intent = 'consultation_offer';
    } else if (isDataCollection) {
      intent = 'data_collection';
    } else if (lowerMessage.includes('legal') || lowerMessage.includes('law') || lowerMessage.includes('attorney')) {
      intent = 'legal_inquiry';
    }

    return {
      intent,
      shouldOfferConsultation,
      isDataCollection,
      suggestedActions: isDataCollection ? ['collect_contact_info'] : []
    };
  }

  async generateWelcomeMessage(tenantId: string = 'demo'): Promise<AIResponse> {
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
}