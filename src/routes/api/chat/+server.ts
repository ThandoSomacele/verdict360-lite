import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { aiService } from '$lib/services/aiService';
import { v4 as uuidv4 } from 'uuid';

// Simple in-memory storage for demo (resets on deploy)
const conversations = new Map<string, any[]>();

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { message, conversationId } = await request.json();

    if (!message) {
      return json({ error: 'Message is required' }, { status: 400 });
    }

    // Use conversationId or create new one
    const convId = conversationId || uuidv4();

    // Get or create conversation history in memory
    if (!conversations.has(convId)) {
      conversations.set(convId, []);
    }

    const history = conversations.get(convId) || [];

    // Add user message to history
    history.push({
      id: uuidv4(),
      content: message,
      sender_type: 'visitor',
      sent_at: new Date().toISOString()
    });

    // Keep only last 10 messages for context
    const recentHistory = history.slice(-10);

    // Generate AI response
    const tenantId = request.headers.get('X-Tenant-Id') || '11111111-1111-1111-1111-111111111111';
    const aiResponse = await aiService.generateResponse(
      message,
      recentHistory,
      tenantId
    );

    // Add AI response to history
    history.push({
      id: uuidv4(),
      content: aiResponse.response,
      sender_type: 'bot',
      sent_at: new Date().toISOString(),
      metadata: aiResponse.metadata
    });

    // Update conversation in memory
    conversations.set(convId, history);

    return json({
      success: true,
      response: aiResponse.response,
      metadata: aiResponse.metadata,
      conversationId: convId
    });
  } catch (error) {
    console.error('Chat API error:', error);

    // For production, try to use AI service directly without database
    try {
      const tenantId = request.headers.get('X-Tenant-Id') || '11111111-1111-1111-1111-111111111111';
      const { message } = await request.json();

      // Simple AI response without history
      const aiResponse = await aiService.generateResponse(
        message || 'hello',
        [],
        tenantId
      );

      return json({
        success: true,
        response: aiResponse.response,
        metadata: aiResponse.metadata,
        conversationId: uuidv4()
      });
    } catch (aiError) {
      console.error('AI Service error:', aiError);

      // Final fallback
      return json({
        success: true,
        response: "I understand you need legal assistance. Our attorneys can provide expert guidance on South African law. Would you like to schedule a consultation?",
        metadata: {
          intent: 'general_inquiry',
          shouldOfferConsultation: true
        },
        conversationId: uuidv4()
      });
    }
  }
};