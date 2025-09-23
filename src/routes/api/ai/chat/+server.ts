import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { aiService } from '$lib/services/aiService';
import type { ChatMessage } from '$lib/types';

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { message, conversationHistory } = body;

    if (!message || typeof message !== 'string') {
      return json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate conversation history if provided
    let history: ChatMessage[] = [];
    if (conversationHistory && Array.isArray(conversationHistory)) {
      history = conversationHistory.slice(-10); // Keep last 10 messages for context
    }

    const aiResponse = await aiService.generateResponse(
      message.trim(),
      history,
      locals.tenantId
    );

    return json(aiResponse);
  } catch (error) {
    console.error('AI Chat error:', error);
    
    return json({
      response: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
      metadata: {
        intent: 'error',
        shouldOfferConsultation: false,
        isDataCollection: false,
        tenantId: locals.tenantId,
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
};