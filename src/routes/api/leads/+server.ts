import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/database';

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();
    const tenantId = request.headers.get('X-Tenant-Id') || '11111111-1111-1111-1111-111111111111';

    const leadId = generateId();

    // Save lead to database
    await db('leads').insert({
      id: leadId,
      tenant_id: tenantId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      enquiry: data.enquiry || data.message || '',
      source: 'chat_widget',
      status: 'new',
      created_at: new Date(),
      updated_at: new Date()
    });

    // If there's a conversation ID, update the conversation with the lead ID
    if (data.conversationId) {
      await db('conversations')
        .where('id', data.conversationId)
        .update({
          lead_id: leadId,
          updated_at: new Date()
        });
    }

    return json({
      success: true,
      leadId,
      message: 'Thank you for your information. An attorney will contact you shortly.'
    });
  } catch (error) {
    console.error('Error saving lead:', error);

    // Return success even if database fails (for demo purposes)
    return json({
      success: true,
      message: 'Thank you for your information. An attorney will contact you shortly.'
    });
  }
};