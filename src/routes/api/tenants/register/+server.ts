import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/config/database';
import { authService } from '$lib/services/authService';
import { emailService } from '$lib/services/emailService';
import { z } from 'zod';
import { randomUUID } from 'crypto';

const tenantRegistrationSchema = z.object({
  // Company Info
  companyName: z.string().min(2, 'Company name required'),
  subdomain: z.string()
    .min(3, 'Subdomain must be at least 3 characters')
    .regex(/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens'),
  industry: z.string().optional(),

  // Admin User
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),

  // Plan
  plan: z.enum(['starter', 'professional', 'enterprise']).default('starter'),

  // Terms
  termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms')
});

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = tenantRegistrationSchema.parse(body);

    // Check if subdomain already exists
    const existingTenant = await db('tenants')
      .where('subdomain', validatedData.subdomain)
      .first();

    if (existingTenant) {
      return json(
        { success: false, error: 'This subdomain is already taken' },
        { status: 409 }
      );
    }

    // Check if email already exists
    const existingUser = await db('users')
      .where('email', validatedData.email)
      .first();

    if (existingUser) {
      return json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Start transaction to ensure atomicity
    const result = await db.transaction(async (trx) => {
      // 1. Create the tenant
      const tenantId = randomUUID();
      const [tenant] = await trx('tenants').insert({
        id: tenantId,
        name: validatedData.companyName,
        subdomain: validatedData.subdomain,
        status: 'trial',
        plan: validatedData.plan,
        industry: validatedData.industry || 'general',
        trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        created_at: new Date(),
        updated_at: new Date()
      }).returning('*');

      // 2. Create admin user
      const adminUser = await authService.register({
        email: validatedData.email,
        password: validatedData.password,
        name: `${validatedData.firstName} ${validatedData.lastName}`,
        tenantId: tenantId,
        role: 'admin'
      });

      // 3. Initialize tenant settings
      await trx('tenant_settings').insert({
        tenant_id: tenantId,
        max_leads_per_month: getPlanLimits(validatedData.plan).leads,
        max_users: getPlanLimits(validatedData.plan).users,
        max_assistants: getPlanLimits(validatedData.plan).assistants,
        created_at: new Date()
      }).onConflict('tenant_id').ignore();

      // 4. Log the registration
      await trx('audit_logs').insert({
        tenant_id: tenantId,
        user_id: adminUser.user.id,
        action: 'tenant_registered',
        details: JSON.stringify({
          plan: validatedData.plan,
          subdomain: validatedData.subdomain
        }),
        created_at: new Date()
      }).onConflict().ignore(); // Ignore if audit_logs table doesn't exist

      return {
        tenant,
        adminUser: adminUser.user,
        tokens: {
          accessToken: adminUser.accessToken,
          refreshToken: adminUser.refreshToken
        }
      };
    });

    // 5. Send welcome email (outside transaction)
    try {
      await emailService.sendEmail({
        to: validatedData.email,
        subject: `Welcome to Verdict 360 - ${validatedData.companyName}`,
        html: `
          <h2>Welcome to Verdict 360!</h2>
          <p>Hi ${validatedData.firstName},</p>
          <p>Your law firm's AI assistant platform is ready! Your 14-day free trial has started.</p>

          <h3>Your Account Details:</h3>
          <ul>
            <li><strong>Company:</strong> ${validatedData.companyName}</li>
            <li><strong>URL:</strong> https://${validatedData.subdomain}.verdict360.com</li>
            <li><strong>Plan:</strong> ${validatedData.plan.charAt(0).toUpperCase() + validatedData.plan.slice(1)}</li>
            <li><strong>Trial Ends:</strong> ${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}</li>
          </ul>

          <h3>Next Steps:</h3>
          <ol>
            <li>Log in to your dashboard</li>
            <li>Customize your AI assistant</li>
            <li>Install the chat widget on your website</li>
            <li>Invite your team members</li>
          </ol>

          <p>
            <a href="https://${validatedData.subdomain}.verdict360.com/login"
               style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px;">
              Access Your Dashboard
            </a>
          </p>

          <p>Need help? Reply to this email or call us at 086 123 4567.</p>

          <p>Best regards,<br>The Verdict 360 Team</p>
        `
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the registration if email fails
    }

    return json({
      success: true,
      message: 'Account created successfully!',
      data: {
        tenantId: result.tenant.id,
        subdomain: result.tenant.subdomain,
        loginUrl: `https://${result.tenant.subdomain}.verdict360.com/login`,
        ...result.tokens
      }
    });

  } catch (error) {
    console.error('Tenant registration error:', error);

    if (error instanceof z.ZodError) {
      return json(
        {
          success: false,
          error: 'Validation error',
          details: error.errors
        },
        { status: 400 }
      );
    }

    return json(
      {
        success: false,
        error: 'Registration failed. Please try again.'
      },
      { status: 500 }
    );
  }
};

// Helper function to get plan limits
function getPlanLimits(plan: string) {
  const limits = {
    starter: { leads: 100, users: 2, assistants: 1 },
    professional: { leads: 500, users: 10, assistants: 3 },
    enterprise: { leads: 999999, users: 999999, assistants: 999999 }
  };

  return limits[plan as keyof typeof limits] || limits.starter;
}