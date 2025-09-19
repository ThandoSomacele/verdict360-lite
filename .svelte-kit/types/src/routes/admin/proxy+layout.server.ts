// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { authService } from '$lib/services/authService';

export const load = async ({ cookies, locals }: Parameters<LayoutServerLoad>[0]) => {
  const accessToken = cookies.get('access_token');

  if (!accessToken) {
    throw redirect(303, '/login?redirect=/admin');
  }

  const payload = authService.verifyAccessToken(accessToken);

  if (!payload) {
    // Try refresh token
    const refreshToken = cookies.get('refresh_token');

    if (!refreshToken) {
      throw redirect(303, '/login?redirect=/admin');
    }

    try {
      const { accessToken: newAccessToken } = await authService.refreshAccessToken(refreshToken);

      cookies.set('access_token', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 15,
        path: '/'
      });

      const newPayload = authService.verifyAccessToken(newAccessToken);

      if (!newPayload) {
        throw redirect(303, '/login?redirect=/admin');
      }

      // Check if user is admin
      if (newPayload.role !== 'admin') {
        throw redirect(303, '/dashboard');
      }

      const user = await authService.getUserById(newPayload.userId);

      return {
        user,
        tenantId: newPayload.tenantId
      };
    } catch (error) {
      throw redirect(303, '/login?redirect=/admin');
    }
  }

  // Check if user is admin
  if (payload.role !== 'admin') {
    throw redirect(303, '/dashboard');
  }

  const user = await authService.getUserById(payload.userId);

  return {
    user,
    tenantId: payload.tenantId
  };
};