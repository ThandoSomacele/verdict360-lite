import axios from 'axios';
import removeMd from 'remove-markdown';
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

const SYSTEM_PROMPT = `You are Sarah, a paralegal at Demo Law Firm in Johannesburg. You work at a busy, professional law firm.

CRITICAL RULES:
- MAX 40 WORDS per response
- NO formatting/markdown
- British spelling
- Natural, professional conversation

RESPONSES BY SITUATION:

"Hi/Hello" alone:
"Hi there! What brings you in today? Are you looking for legal advice on a specific matter?"

Accident/death/injury:
"Oh my goodness, I'm so sorry. That must be incredibly difficult. Let me get one of our attorneys to help you right away. Are you okay?"

"No thanks" after trauma:
"I understand completely. Please take care. We're here whenever you're ready."

Normal questions:
Professional but warm. This is a busy law firm. Don't say things like "we don't get visitors often."

ALWAYS:
- Be professional yet caring
- Remember you work at a BUSY law firm
- Sound competent and helpful`;

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
          max_tokens: 100  // Strict limit for very short responses
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
    // Use the remove-markdown library for thorough markdown removal
    let cleanText = removeMd(text, {
      stripListLeaders: false, // Keep numbered list formatting
      gfm: true, // GitHub flavored markdown
      useImgAltText: false // Don't include image alt text
    });

    // Additional aggressive cleanup for any remaining patterns
    cleanText = cleanText.replace(/\*+/g, '');
    cleanText = cleanText.replace(/_+/g, '');
    cleanText = cleanText.replace(/`+/g, '');
    cleanText = cleanText.replace(/~+/g, '');
    cleanText = cleanText.replace(/\|/g, '');

    // Ensure numbered lists are clean
    cleanText = cleanText.replace(/(\d+)\.\s*\*\*(.*?)\*\*/g, '$1. $2');
    cleanText = cleanText.replace(/(\d+)\.\s*\*(.*?)\*/g, '$1. $2');

    // Clean up whitespace
    cleanText = cleanText.replace(/  +/g, ' ');
    cleanText = cleanText.replace(/\n{3,}/g, '\n\n');

    return cleanText.trim();
  }

  private analyzeResponse(response: string, userMessage: string) {
    const lowerResponse = response.toLowerCase();
    const lowerMessage = userMessage.toLowerCase();

    // Check if user is ending conversation
    const endingPhrases = [
      'no thanks', 'no thank you', 'nothing thanks', 'nothing else',
      'goodbye', 'bye', 'that\'s all', 'i\'m done', 'no nothing',
      'all good', 'that is all', 'thanks bye'
    ];

    const isEndingConversation = endingPhrases.some(phrase =>
      lowerMessage.includes(phrase)
    );

    if (isEndingConversation) {
      return {
        intent: 'conversation_end',
        shouldOfferConsultation: false,
        isDataCollection: false,
        suggestedActions: []
      };
    }

    // Check for consultation offer patterns
    const consultationPatterns = [
      'schedule a consultation',
      'arrange that',
      'speak with an attorney',
      'consult with a lawyer',
      'book a consultation',
      'would you like a consultation'
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
      response: "Hi! I'm Sarah from the legal team here at Demo Law Firm. How can I help you today?",
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