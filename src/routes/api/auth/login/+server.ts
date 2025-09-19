import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { authService } from '$lib/services/authService';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  tenantId: z.string().optional()
});

export const POST: RequestHandler = async ({ request, cookies, locals }) => {
  try {
    const body = await request.json();

    // Validate input first (without tenantId requirement)
    const validatedData = loginSchema.parse(body);

    // Add tenant ID from locals or use default
    if (!validatedData.tenantId || validatedData.tenantId === '') {
      validatedData.tenantId = locals.tenantId || '11111111-1111-1111-1111-111111111111';
    }

    // Validate it's a proper UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(validatedData.tenantId)) {
      validatedData.tenantId = '11111111-1111-1111-1111-111111111111';
    }

    // Login user
    const { user, accessToken, refreshToken } = await authService.login(validatedData);

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
    console.error('Login error:', error);

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

    if (error instanceof Error && error.message === 'Invalid credentials') {
      return json(
        {
          success: false,
          error: 'Invalid email or password'
        },
        { status: 401 }
      );
    }

    return json(
      {
        success: false,
        error: 'Login failed'
      },
      { status: 500 }
    );
  }
};