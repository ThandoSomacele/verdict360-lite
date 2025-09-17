import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDb } from '$lib/server/db';

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-key';

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const { email, password, firstName, lastName, companyName } = await request.json();

    if (!email || !password || !firstName || !lastName) {
      return json({
        success: false,
        error: 'All fields are required'
      }, { status: 400 });
    }

    const db = await getDb();

    // Check if user already exists
    const existingUser = await db('users')
      .where({ email })
      .first();

    if (existingUser) {
      return json({
        success: false,
        error: 'Email already registered'
      }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get default tenant or create new one
    let tenantId = 1; // Default tenant ID
    if (companyName) {
      // Create new tenant for the company
      const [tenant] = await db('tenants')
        .insert({
          name: companyName,
          subdomain: companyName.toLowerCase().replace(/\s+/g, '-'),
          settings: JSON.stringify({
            primaryColor: '#16a34a',
            logo: null
          }),
          created_at: new Date(),
          updated_at: new Date()
        })
        .returning('*');
      tenantId = tenant.id;
    }

    // Create user
    const [user] = await db('users')
      .insert({
        tenant_id: tenantId,
        email,
        password: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning('*');

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
      maxAge: 60 * 60 * 24
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
    console.error('Signup error:', error);

    // Demo mode fallback
    if (process.env.DEMO_MODE === 'true') {
      const demoUser = {
        id: 'demo-user-new',
        email: request.json().then(data => data.email),
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
        token,
        message: 'Demo account created'
      });
    }

    return json({
      success: false,
      error: 'Signup failed'
    }, { status: 500 });
  }
};