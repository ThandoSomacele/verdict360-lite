import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDb } from '$lib/server/db';

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-key';

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return json({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 });
    }

    const db = await getDb();
    const user = await db('users')
      .where({ email })
      .first();

    if (!user) {
      return json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        tenant_id: user.tenant_id,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    cookies.set('token', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);

    // Demo mode fallback
    if (process.env.DEMO_MODE === 'true') {
      const demoUser = {
        id: 'demo-user',
        email: 'demo@verdict360.com',
        first_name: 'Demo',
        last_name: 'User',
        role: 'user'
      };

      const token = jwt.sign(demoUser, JWT_SECRET, { expiresIn: '24h' });

      cookies.set('token', token, {
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24
      });

      return json({
        success: true,
        user: demoUser,
        token
      });
    }

    return json({
      success: false,
      error: 'Login failed'
    }, { status: 500 });
  }
};