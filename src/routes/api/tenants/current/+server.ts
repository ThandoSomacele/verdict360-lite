import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/config/database';
import type { Tenant } from '$lib/types';

export const GET: RequestHandler = async ({ locals }) => {
  try {
    const tenantId = locals.tenantId || 'demo';
    
    // Try to fetch tenant from database
    let tenant: Partial<Tenant> | null = null;
    
    try {
      const result = await db('tenants')
        .where('subdomain', tenantId)
        .orWhere('id', tenantId)
        .first();
      
      if (result) {
        tenant = {
          id: result.id,
          name: result.name,
          subdomain: result.subdomain,
          email: result.email,
          phone: result.phone,
          status: result.status,
          branding: {
            companyName: result.name,
            primaryColor: result.primary_color || '#2563eb',
            secondaryColor: result.secondary_color || '#f3f4f6',
            welcomeMessage: result.welcome_message || `Welcome to ${result.name} AI Assistant`
          },
          settings: {
            businessHours: {
              timezone: result.timezone || 'Africa/Johannesburg',
              workingDays: result.working_days ? JSON.parse(result.working_days) : ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
              startTime: result.start_time || '09:00',
              endTime: result.end_time || '17:00'
            },
            notifications: {
              emailNotifications: result.email_notifications !== false,
              smsNotifications: result.sms_notifications !== false
            }
          }
        };
      }
    } catch (dbError) {
      console.warn('Database not available, using demo tenant:', dbError);
    }

    // Fallback to demo tenant if database lookup fails
    if (!tenant) {
      tenant = {
        id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
        name: 'Demo Law Firm',
        subdomain: tenantId,
        status: 'active',
        branding: {
          companyName: 'Demo Law Firm',
          primaryColor: '#2563eb',
          secondaryColor: '#f3f4f6',
          welcomeMessage: 'Welcome to Demo Law Firm AI Assistant'
        },
        settings: {
          businessHours: {
            timezone: 'Africa/Johannesburg',
            workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
            startTime: '09:00',
            endTime: '17:00'
          },
          notifications: {
            emailNotifications: true,
            smsNotifications: false
          }
        }
      };
    }

    return json(tenant);
  } catch (error) {
    console.error('Error fetching tenant:', error);
    
    // Return error response
    return json(
      { error: 'Unable to fetch tenant information' },
      { status: 500 }
    );
  }
};