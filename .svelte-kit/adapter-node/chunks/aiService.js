import axios from "axios";
import removeMd from "remove-markdown";
const OLLAMA_BASE_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const DEFAULT_MODEL = process.env.AI_MODEL || "llama3.2:latest";
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
  model;
  baseUrl;
  constructor() {
    this.model = DEFAULT_MODEL;
    this.baseUrl = OLLAMA_BASE_URL;
  }
  async generateResponse(message, conversationHistory = [], tenantId = "11111111-1111-1111-1111-111111111111") {
    try {
      const messages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...conversationHistory.slice(-10).map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.content
        })),
        { role: "user", content: message }
      ];
      const request = {
        model: this.model,
        messages,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 100
          // Strict limit for very short responses
        }
      };
      const response = await axios.post(`${this.baseUrl}/api/chat`, request);
      let aiResponse = response.data.message?.content || "I apologize, but I encountered an error processing your request.";
      aiResponse = this.stripMarkdown(aiResponse);
      const metadata = this.analyzeResponse(aiResponse, message);
      return {
        response: aiResponse,
        metadata: {
          ...metadata,
          tenantId,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      };
    } catch (error) {
      console.error("AI Service Error:", error);
      return {
        response: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
        metadata: {
          intent: "error",
          shouldOfferConsultation: false,
          isDataCollection: false,
          tenantId,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      };
    }
  }
  stripMarkdown(text) {
    let cleanText = removeMd(text, {
      stripListLeaders: false,
      // Keep numbered list formatting
      gfm: true,
      // GitHub flavored markdown
      useImgAltText: false
      // Don't include image alt text
    });
    cleanText = cleanText.replace(/\*+/g, "");
    cleanText = cleanText.replace(/_+/g, "");
    cleanText = cleanText.replace(/`+/g, "");
    cleanText = cleanText.replace(/~+/g, "");
    cleanText = cleanText.replace(/\|/g, "");
    cleanText = cleanText.replace(/(\d+)\.\s*\*\*(.*?)\*\*/g, "$1. $2");
    cleanText = cleanText.replace(/(\d+)\.\s*\*(.*?)\*/g, "$1. $2");
    cleanText = cleanText.replace(/  +/g, " ");
    cleanText = cleanText.replace(/\n{3,}/g, "\n\n");
    return cleanText.trim();
  }
  analyzeResponse(response, userMessage) {
    const lowerResponse = response.toLowerCase();
    const lowerMessage = userMessage.toLowerCase();
    const endingPhrases = [
      "no thanks",
      "no thank you",
      "nothing thanks",
      "nothing else",
      "goodbye",
      "bye",
      "that's all",
      "i'm done",
      "no nothing",
      "all good",
      "that is all",
      "thanks bye"
    ];
    const isEndingConversation = endingPhrases.some(
      (phrase) => lowerMessage.includes(phrase)
    );
    if (isEndingConversation) {
      return {
        intent: "conversation_end",
        shouldOfferConsultation: false,
        isDataCollection: false,
        suggestedActions: []
      };
    }
    const consultationPatterns = [
      "schedule a consultation",
      "arrange that",
      "speak with an attorney",
      "consult with a lawyer",
      "book a consultation",
      "would you like a consultation",
      "arrange for an attorney",
      "attorney to contact you",
      "contact attorneys",
      "collect your contact details",
      "need your email and phone"
    ];
    const shouldOfferConsultation = consultationPatterns.some(
      (pattern) => lowerResponse.includes(pattern)
    );
    const dataCollectionTriggers = [
      "contact details",
      "personal information",
      "schedule a consultation",
      "arrange that",
      "book a consultation",
      "collect your contact details",
      "let me collect",
      "can reach you",
      "attorney can provide",
      "attorney reach out",
      "proper documentation"
    ];
    const isDataCollection = dataCollectionTriggers.some(
      (trigger) => lowerResponse.includes(trigger)
    );
    let intent = "general_inquiry";
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("good")) {
      intent = "greeting";
    } else if (shouldOfferConsultation) {
      intent = "consultation_offer";
    } else if (isDataCollection) {
      intent = "data_collection";
    } else if (lowerMessage.includes("legal") || lowerMessage.includes("law") || lowerMessage.includes("attorney")) {
      intent = "legal_inquiry";
    }
    return {
      intent,
      shouldOfferConsultation,
      isDataCollection,
      suggestedActions: isDataCollection ? ["collect_contact_info"] : []
    };
  }
  async generateWelcomeMessage(tenantId = "11111111-1111-1111-1111-111111111111") {
    return {
      response: "Hi! I'm Sarah, an AI legal assistant at Demo Law Firm. I can help answer questions and connect you with our attorneys. How may I assist you today?",
      metadata: {
        intent: "greeting",
        shouldOfferConsultation: false,
        isDataCollection: false,
        tenantId,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }
    };
  }
}
export {
  AIService as A
};
