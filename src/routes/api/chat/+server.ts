import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { aiService } from '$lib/services/aiService';
import { db } from '$lib/server/database';

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { message, conversationId } = await request.json();

    if (!message) {
      return json({ error: 'Message is required' }, { status: 400 });
    }

    // Get or create conversation
    let conversation;
    if (conversationId) {
      conversation = await db('conversations')
        .where('id', conversationId)
        .first();
    }

    if (!conversation) {
      // Create new conversation
      const newConversationId = conversationId || generateId();
      const tenantId = request.headers.get('X-Tenant-Id') || '11111111-1111-1111-1111-111111111111';

      await db('conversations').insert({
        id: newConversationId,
        tenant_id: tenantId,
        visitor_id: generateId(),
        status: 'active',
        started_at: new Date(),
        message_count: 0,
        created_at: new Date(),
        updated_at: new Date()
      });
      conversation = { id: newConversationId };
    }

    // Save user message
    await db('messages').insert({
      id: generateId(),
      conversation_id: conversation.id,
      sender: 'user',
      content: message,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Get conversation history
    const previousMessages = await db('messages')
      .where('conversation_id', conversation.id)
      .orderBy('created_at', 'asc')
      .limit(10);

    // Generate AI response
    const tenantId = request.headers.get('X-Tenant-Id') || '11111111-1111-1111-1111-111111111111';
    const aiResponse = await aiService.generateResponse(
      message,
      previousMessages,
      tenantId
    );

    // Save AI response
    await db('messages').insert({
      id: generateId(),
      conversation_id: conversation.id,
      sender: 'ai',
      content: aiResponse.response,
      metadata: aiResponse.metadata,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Update conversation message count
    await db('conversations')
      .where('id', conversation.id)
      .increment('message_count', 2)
      .update({ updated_at: new Date() });

    return json({
      success: true,
      response: aiResponse.response,
      metadata: aiResponse.metadata,
      conversationId: conversation.id
    });
  } catch (error) {
    console.error('Chat API error:', error);

    // Return a fallback response for demo
    return json({
      success: true,
      response: "I understand you need legal assistance. Our attorneys can provide expert guidance on South African law. Would you like to schedule a consultation?",
      metadata: {
        intent: 'general_inquiry',
        shouldOfferConsultation: true
      }
    });
  }
};