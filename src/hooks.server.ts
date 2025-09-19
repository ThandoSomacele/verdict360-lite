import type { Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';

export const handle: Handle = async ({ event, resolve }) => {
  // Extract tenant ID from subdomain or header
  const hostname = event.url.hostname;
  const subdomain = hostname.split('.')[0];
  let tenantId = '11111111-1111-1111-1111-111111111111'; // Default tenant UUID

  // For development, also check for specific localhost subdomains
  if (dev && hostname.includes('localhost')) {
    // Support format: tenant.localhost:3000
    if (subdomain && subdomain !== 'localhost' && subdomain !== 'www') {
      tenantId = subdomain;
    }
    // Also check X-Tenant-Id header for API calls
    const headerTenant = event.request.headers.get('X-Tenant-Id');
    if (headerTenant) {
      tenantId = headerTenant;
    }
  } else if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
    tenantId = subdomain;
  }

  // Set tenant context
  event.locals.tenantId = tenantId;

  // Handle CORS for API routes
  if (event.url.pathname.startsWith('/api/')) {
    const origin = event.request.headers.get('origin');
    
    if (event.request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': origin || '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Tenant-Id',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Max-Age': '86400'
        }
      });
    }
  }

  const response = await resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range';
    }
  });

  // Add CORS headers to API responses
  if (event.url.pathname.startsWith('/api/')) {
    const origin = event.request.headers.get('origin');
    response.headers.set('Access-Control-Allow-Origin', origin || '*');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return response;
};

// Type definitions for locals
declare global {
  namespace App {
    interface Locals {
      tenantId: string;
    }
  }
}