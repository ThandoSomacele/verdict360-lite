import axios from 'axios';
import removeMd from 'remove-markdown';
import type { ChatMessage, AIResponse } from '$lib/types';
import { groqService } from './groqService';

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

// Using Groq Cloud instead of Ollama for production
const USE_GROQ = process.env.USE_GROQ !== 'false';
const OLLAMA_BASE_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.AI_MODEL || 'llama3.2:latest';

const SYSTEM_PROMPT = `You are Sarah, a paralegal at Demo Law Firm in Johannesburg. You work at a professional law firm.

CRITICAL RULES:
- MAX 40 WORDS per response
- NO formatting/markdown
- British spelling
- Natural, professional conversation
- NEVER claim to send emails or have user's contact information
- NEVER say you've sent something unless explicitly true

RESPONSES BY SITUATION:

"Hi/Hello" alone:
"Hi there! What brings you in today? Are you looking for legal advice on a specific matter?"

Accident/death/injury:
"Oh my goodness, I'm so sorry. That must be incredibly difficult. Let me get one of our attorneys to help you right away. Are you okay?"

When user wants to contact attorneys/needs consultation:
"I'll arrange for an attorney to contact you. Let me collect your contact details so we can assist you properly."

When user needs legal assistance/documents/templates:
"I'd be happy to help with that. Let me collect your contact details so an attorney can provide you with the proper documentation."

When user asks to see template/document in chat:
"I cannot provide legal documents in chat. Let me collect your contact details so an attorney can send you the proper documentation."

When user provides partial information (just name, no contact):
"Thank you. I'll also need your email and phone number so our attorneys can reach you."

When user confirms they need help (yes/okay to assistance):
"Perfect. Let me collect your contact details and we'll have an attorney reach out with the information you need."

"No thanks" after trauma:
"I understand completely. Please take care. We're here whenever you're ready."

IMPORTANT LIMITATIONS:
- You CANNOT send emails
- You DON'T have user contact information unless they provide it
- NEVER provide templates, documents, or legal text in chat
- NEVER write out legal documents or forms
- ALL documents require attorney review and proper delivery
- NEVER ask for third-party details (neighbor info, opposing party contacts)

ALWAYS:
- Be professional yet caring
- Never claim abilities you don't have
- When user needs documents/templates, collect contact details first
- Sound competent, helpful and available
- Never claim to have user information unless explicitly provided
- Always ask for ALL contact details (name, email, phone)`;

class AIService {
  private model: string;
  private baseUrl: string;

  constructor() {
    this.model = DEFAULT_MODEL;
    this.baseUrl = OLLAMA_BASE_URL;
  }

  async generateResponse(
    message: string,
    conversationHistory: ChatMessage[] = [],
    tenantId: string = '11111111-1111-1111-1111-111111111111'
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

      let aiResponse: string;

      // Use Groq if available, fallback to Ollama
      if (USE_GROQ && groqService.isAvailable()) {
        const groqResponse = await groqService.chat(messages);
        if (groqResponse.success && groqResponse.data) {
          aiResponse = groqResponse.data;
        } else {
          throw new Error(groqResponse.error || 'Groq service failed');
        }
      } else {
        // Fallback to Ollama for local development
        const request: OllamaRequest = {
          model: this.model,
          messages,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 45  // Very strict limit to ensure 40-word responses
          }
        };

        const response = await axios.post(`${this.baseUrl}/api/chat`, request);
        aiResponse = response.data.message?.content || 'I apologize, but I encountered an error processing your request.';
      }

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
      'would you like a consultation',
      'arrange for an attorney',
      'attorney to contact you',
      'contact attorneys',
      'collect your contact details',
      'need your email and phone'
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
      'book a consultation',
      'collect your contact details',
      'let me collect',
      'can reach you',
      'attorney can provide',
      'attorney reach out',
      'proper documentation'
    ];

    const isDataCollection = dataCollectionTriggers.some(trigger =>
      lowerResponse.includes(trigger)
    );

    // Determine intent based on user message and AI response
    let intent = 'general_inquiry';

    // Check for legal terms and phrases
    const legalTerms = [
      'letter of demand', 'divorce', 'contract', 'agreement', 'deed', 'will',
      'estate', 'litigation', 'dispute', 'court', 'legal', 'law', 'attorney',
      'lawyer', 'advocate', 'eviction', 'custody', 'maintenance', 'damages',
      'claim', 'sue', 'labour', 'employment', 'dismissal', 'ccma', 'tribunal',
      'criminal', 'defence', 'prosecution', 'bail', 'appeal', 'settlement',
      'mediation', 'arbitration', 'compliance', 'regulatory', 'intellectual property',
      'trademark', 'copyright', 'patent', 'property', 'conveyancing', 'transfer',
      'bond', 'lease', 'rental', 'tenant', 'landlord', 'popia', 'gdpr',
      'compensation', 'injury', 'accident', 'insurance', 'claim'
    ];

    const hasLegalTerm = legalTerms.some(term => lowerMessage.includes(term));

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('good')) {
      intent = 'greeting';
    } else if (shouldOfferConsultation) {
      intent = 'consultation_offer';
    } else if (isDataCollection) {
      intent = 'data_collection';
    } else if (hasLegalTerm) {
      intent = 'legal_inquiry';
    }

    return {
      intent,
      shouldOfferConsultation,
      isDataCollection,
      suggestedActions: isDataCollection ? ['collect_contact_info'] : []
    };
  }

  async generateWelcomeMessage(tenantId: string = '11111111-1111-1111-1111-111111111111'): Promise<AIResponse> {
    return {
      response: "Hi! I'm Sarah, an AI legal assistant at Demo Law Firm. I can help answer questions and connect you with our attorneys. How may I assist you today?",
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

export const aiService = new AIService();
