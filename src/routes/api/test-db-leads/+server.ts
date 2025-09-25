import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/database';

export const GET: RequestHandler = async () => {
  try {
    // Try to count leads in the database
    const result = await db('leads').count('* as count');
    const count = result[0].count;

    // Also try to get the most recent lead
    const recentLeads = await db('leads')
      .select('id', 'first_name', 'last_name', 'email', 'created_at')
      .orderBy('created_at', 'desc')
      .limit(5);

    return json({
      success: true,
      message: 'Database connection successful',
      leadCount: count,
      recentLeads,
      databaseUrl: process.env.DATABASE_URL ? 'Configured' : 'Not configured',
      nodeEnv: process.env.NODE_ENV || 'not set'
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      databaseUrl: process.env.DATABASE_URL ? 'Configured' : 'Not configured',
      nodeEnv: process.env.NODE_ENV || 'not set',
      errorDetails: String(error)
    }, { status: 500 });
  }
};