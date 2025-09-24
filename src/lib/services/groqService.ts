import Groq from 'groq-sdk';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  success: boolean;
  data?: string;
  error?: string;
}

class GroqService {
  private groq: Groq | null = null;
  private isInitialized = false;
  private initializationAttempted = false;

  constructor() {
    // Don't initialize in constructor to avoid import.meta.env access during build
  }

  private initialize() {
    if (this.initializationAttempted) return;
    this.initializationAttempted = true;

    // Try different ways to get the API key
    const apiKey = (process.env.GROQ_API_KEY ||
                   process.env.VITE_GROQ_API_KEY ||
                   (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GROQ_API_KEY) || '')?.trim();

    if (!apiKey) {
      console.warn('Groq API key not configured. AI features will be limited.');
      return;
    }

    try {
      this.groq = new Groq({
        apiKey: apiKey // Already trimmed above
      });
      this.isInitialized = true;
      console.log('Groq AI service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Groq:', error);
    }
  }

  async chat(messages: ChatMessage[]): Promise<ChatResponse> {
    // Lazy initialization
    if (!this.initializationAttempted) {
      this.initialize();
    }

    if (!this.isInitialized || !this.groq) {
      return {
        success: false,
        error: 'AI service not available. Please configure Groq API key.'
      };
    }

    try {
      // Add South African legal context
      const systemMessage: ChatMessage = {
        role: 'system',
        content: `You are a helpful AI legal assistant for South African law firms.
        You provide information about South African law, POPIA compliance, and legal procedures.
        You help with scheduling consultations and answering common legal questions.
        Always clarify that you provide general information only and clients should consult with an attorney for specific legal advice.
        Be professional, helpful, and concise.`
      };

      const allMessages = [systemMessage, ...messages];

      const modelName = (process.env.GROQ_MODEL ||
                        process.env.VITE_GROQ_MODEL ||
                        (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GROQ_MODEL) ||
                        'llama-3.1-8b-instant').trim(); // Trim to remove any whitespace/newlines

      const completion = await this.groq.chat.completions.create({
        messages: allMessages,
        model: modelName,
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1,
        stream: false
      });

      const response = completion.choices[0]?.message?.content;

      if (!response) {
        throw new Error('No response from AI model');
      }

      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Groq chat error:', error);

      // Provide a fallback response for demos
      if (error instanceof Error && error.message.includes('API key')) {
        return {
          success: true,
          data: "I'm currently in demo mode. In production, I'll be able to help you with South African legal queries, POPIA compliance, and scheduling consultations. How can I assist you today?"
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get AI response'
      };
    }
  }

  async generateLegalResponse(query: string, context?: string): Promise<ChatResponse> {
    const messages: ChatMessage[] = [
      {
        role: 'user',
        content: context ? `Context: ${context}\n\nQuery: ${query}` : query
      }
    ];

    return this.chat(messages);
  }

  isAvailable(): boolean {
    // Lazy initialization
    if (!this.initializationAttempted) {
      this.initialize();
    }
    return this.isInitialized;
  }
}

export const groqService = new GroqService();