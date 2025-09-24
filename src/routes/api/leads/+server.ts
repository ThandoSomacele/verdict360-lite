import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// In-memory storage for demo (resets on deploy)
const leads = new Map<string, any>();

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();
    const tenantId = request.headers.get('X-Tenant-Id') || '11111111-1111-1111-1111-111111111111';

    const leadId = generateId();

    // Store lead in memory for demo
    const lead = {
      id: leadId,
      tenant_id: tenantId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      enquiry: data.enquiry || data.message || '',
      source: 'chat_widget',
      status: 'new',
      conversation_id: data.conversationId,
      created_at: new Date(),
      updated_at: new Date()
    };

    // Store in memory
    leads.set(leadId, lead);

    // Log for demo purposes
    console.log('New lead received:', {
      id: leadId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      enquiry: data.enquiry || data.message
    });

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