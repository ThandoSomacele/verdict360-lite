import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { authService } from '$lib/services/authService';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  tenantId: z.string().optional(),
  role: z.enum(['admin', 'user', 'viewer']).optional()
});

export const POST: RequestHandler = async ({ request, cookies, locals }) => {
  try {
    const body = await request.json();

    // Validate input first (without tenantId requirement)
    const validatedData = registerSchema.parse(body);

    // Add tenant ID from locals or use default
    if (!validatedData.tenantId || validatedData.tenantId === '') {
      validatedData.tenantId = locals.tenantId || '11111111-1111-1111-1111-111111111111';
    }

    // Validate it's a proper UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(validatedData.tenantId)) {
      validatedData.tenantId = '11111111-1111-1111-1111-111111111111';
    }

    // Register user
    const { user, accessToken, refreshToken } = await authService.register(validatedData);

    // Set cookies
    cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 15, // 15 minutes
      path: '/'
    });

    cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return json({
      success: true,
      user,
      accessToken
    });
  } catch (error) {
    console.error('Registration error:', error);

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

    if (error instanceof Error && error.message === 'User already exists') {
      return json(
        {
          success: false,
          error: 'User already exists'
        },
        { status: 409 }
      );
    }

    return json(
      {
        success: false,
        error: 'Registration failed'
      },
      { status: 500 }
    );
  }
};