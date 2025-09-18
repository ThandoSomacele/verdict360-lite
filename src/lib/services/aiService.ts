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

const SYSTEM_PROMPT = `You are a helpful AI assistant specializing in South African law. You provide accurate, informative responses about legal matters in South Africa.

CRITICAL FORMATTING RULES - YOU MUST FOLLOW THESE:
- Use ONLY plain text - absolutely no asterisks, no markdown, no formatting
- Write numbers as "1." not "1.**" or "**1.**"
- Never use ** for bold or * for italics
- Keep responses under 150 words maximum
- Use simple numbered lists: "1. First point" not "1. **First point**"

LANGUAGE REQUIREMENTS:
- Use British/South African English spelling ONLY (NOT American)
- Examples: colour (not color), organisation (not organization), labour (not labor)
- Use "realise" not "realize", "centre" not "center", "defence" not "defense"
- Use "programme" not "program", "cheque" not "check", "licence" (noun) not "license"

Key guidelines:
1. Focus on South African law and regulations
2. Give SHORT, DIRECT answers - maximum 3-4 key points
3. Be consistent - never offer something you cannot provide
4. For complex legal documents (wills, contracts, agreements):
   - NEVER offer templates or drafts
   - State: "For [document type], you need a qualified attorney"
5. Always recommend professional consultation for specific cases
6. Be empathetic and professional

Important rules:
- For wills: Say "For will preparation, you need a qualified attorney to ensure validity."
- Keep answers brief and practical
- No lengthy explanations

When consultation needed: "I recommend consulting with an attorney for your specific situation. Would you like help arranging that?"`;

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
          max_tokens: 200  // Further reduced to enforce brevity
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
      response: "Hello! I specialise in South African legal enquiries. How can I help you today?",
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