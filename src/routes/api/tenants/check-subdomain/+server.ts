import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/config/database';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { subdomain } = await request.json();

    if (!subdomain || subdomain.length < 3) {
      return json({ available: false, error: 'Subdomain too short' });
    }

    // Check if it's a valid subdomain format
    const validFormat = /^[a-z0-9-]+$/.test(subdomain);
    if (!validFormat) {
      return json({
        available: false,
        error: 'Subdomain can only contain lowercase letters, numbers, and hyphens'
      });
    }

    // Reserved subdomains
    const reserved = ['www', 'app', 'api', 'admin', 'dashboard', 'blog', 'help', 'support', 'demo'];
    if (reserved.includes(subdomain)) {
      return json({ available: false, error: 'This subdomain is reserved' });
    }

    // Check database
    const existing = await db('tenants')
      .where('subdomain', subdomain)
      .first();

    return json({
      available: !existing,
      subdomain
    });

  } catch (error) {
    console.error('Subdomain check error:', error);
    return json({ available: false, error: 'Unable to check availability' });
  }
};