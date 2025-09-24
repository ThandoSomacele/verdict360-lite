import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  try {
    // Import Groq service
    const { groqService } = await import('$lib/services/groqService');

    // Check if service is available
    const isAvailable = groqService.isAvailable();

    // Try to make a simple chat request
    let testResponse = null;
    let error = null;

    if (isAvailable) {
      try {
        const response = await groqService.chat([
          { role: 'user', content: 'Say hello in 5 words or less' }
        ]);
        testResponse = response;
      } catch (e: any) {
        error = e.message;
      }
    }

    // Check environment variables
    const env = {
      hasGroqKey: !!process.env.GROQ_API_KEY,
      hasViteGroqKey: !!process.env.VITE_GROQ_API_KEY,
      groqKeyLength: process.env.GROQ_API_KEY?.length || 0,
      viteGroqKeyLength: process.env.VITE_GROQ_API_KEY?.length || 0,
      groqModel: process.env.GROQ_MODEL || 'not set',
      viteGroqModel: process.env.VITE_GROQ_MODEL || 'not set'
    };

    return json({
      success: isAvailable && testResponse?.success,
      isAvailable,
      testResponse,
      error,
      env
    });
  } catch (error: any) {
    return json({
      success: false,
      error: 'Failed to test AI service',
      details: error.message
    });
  }
};