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
const DEFAULT_MODEL = process.env.AI_MODEL || 'llama3.2:latest';

const SYSTEM_PROMPT = `You are a helpful AI assistant specializing in South African law. You provide accurate, informative responses about legal matters in South Africa.

Key guidelines:
1. Focus on South African law and regulations
2. Provide clear, CONCISE explanations - avoid lengthy responses unless necessary
3. Be consistent - never offer something you cannot provide
4. For complex legal documents (wills, contracts, agreements):
   - NEVER offer to provide templates or drafts
   - Explain key requirements and considerations
   - Always direct to a qualified attorney for document preparation
5. Always recommend professional legal consultation for specific cases
6. Be empathetic and professional
7. Format responses in plain text only - no markdown, no special formatting
8. Keep responses focused and to the point

Important rules:
- For wills specifically: Explain the requirements but NEVER offer templates. State clearly: "For will preparation, you need a qualified attorney to ensure validity and proper execution."
- When unsure: "I can provide general information about [topic], but for your specific situation, consulting with an attorney would be best."
- Avoid over-explaining or justifying previous responses

When consultation is beneficial, say: "I'd recommend scheduling a consultation to discuss this matter in detail. Would you like me to help arrange that?"`;

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
          max_tokens: 500  // Reduced to encourage more concise responses
        }
      };

      const response = await axios.post(`${this.baseUrl}/api/chat`, request);
      let aiResponse = response.data.message?.content || 'I apologize, but I encountered an error processing your request.';

      // Strip any markdown formatting that might still come through
      aiResponse = this.stripMarkdown(aiResponse);

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

  private stripMarkdown(text: string): string {
    // Remove bold markers
    text = text.replace(/\*\*(.*?)\*\*/g, '$1');
    text = text.replace(/__(.*?)__/g, '$1');

    // Remove italic markers
    text = text.replace(/\*(.*?)\*/g, '$1');
    text = text.replace(/_(.*?)_/g, '$1');

    // Remove code blocks
    text = text.replace(/```[\s\S]*?```/g, '');
    text = text.replace(/`([^`]+)`/g, '$1');

    // Remove headers
    text = text.replace(/^#{1,6}\s+/gm, '');

    // Remove links but keep the text
    text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');

    // Remove horizontal rules
    text = text.replace(/^[-*_]{3,}$/gm, '');

    // Remove blockquotes
    text = text.replace(/^>\s+/gm, '');

    // Clean up excessive whitespace
    text = text.replace(/\n{3,}/g, '\n\n');

    return text.trim();
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
      response: "Hello! I'm your AI legal assistant for South African law. How can I help you today?",
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