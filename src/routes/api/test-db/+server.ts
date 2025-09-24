import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  try {
    // Test if database connection string is available
    const dbUrl = process.env.DATABASE_URL;

    if (!dbUrl) {
      return json({
        success: false,
        error: 'DATABASE_URL not configured',
        env: {
          hasDbUrl: false,
          hasGroqKey: !!process.env.GROQ_API_KEY,
          hasViteGroqKey: !!process.env.VITE_GROQ_API_KEY,
          nodeEnv: process.env.NODE_ENV
        }
      });
    }

    // Try to import and test database connection
    try {
      const { db } = await import('$lib/server/database');

      // Simple query to test connection
      const result = await db.raw('SELECT 1 as test');

      return json({
        success: true,
        message: 'Database connection successful',
        result: result.rows,
        env: {
          hasDbUrl: true,
          dbUrlPrefix: dbUrl.substring(0, 30) + '...',
          hasGroqKey: !!process.env.GROQ_API_KEY,
          hasViteGroqKey: !!process.env.VITE_GROQ_API_KEY,
          nodeEnv: process.env.NODE_ENV
        }
      });
    } catch (dbError: any) {
      return json({
        success: false,
        error: 'Database connection failed',
        details: dbError.message,
        env: {
          hasDbUrl: true,
          dbUrlPrefix: dbUrl.substring(0, 30) + '...',
          hasGroqKey: !!process.env.GROQ_API_KEY,
          hasViteGroqKey: !!process.env.VITE_GROQ_API_KEY,
          nodeEnv: process.env.NODE_ENV
        }
      });
    }
  } catch (error: any) {
    return json({
      success: false,
      error: 'Unexpected error',
      details: error.message
    });
  }
};