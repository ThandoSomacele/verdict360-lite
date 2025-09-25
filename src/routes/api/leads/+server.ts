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
    // Split name into first and last name
    const nameParts = (data.name || '').trim().split(' ');
    const firstName = nameParts[0] || 'Unknown';
    const lastName = nameParts.slice(1).join(' ') || 'User';

    await db('leads').insert({
      id: leadId,
      tenant_id: tenantId,
      first_name: firstName,
      last_name: lastName,
      email: data.email,
      phone: data.phone,
      legal_issue: data.enquiry || data.message || data.enquiryDetails || '',
      status: 'new',
      metadata: JSON.stringify({ source: 'chat_widget', additional_message: data.additionalMessage }),
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

    // Return the actual error for debugging
    return json({
      success: false,
      message: 'Error saving lead',
      error: error instanceof Error ? error.message : 'Unknown error',
      details: String(error)
    }, { status: 500 });
  }
};