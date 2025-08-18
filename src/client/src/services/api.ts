import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
    
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000, // Increased to 30 seconds for AI responses
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add tenant context
    this.api.interceptors.request.use(
      (config) => {
        // Add tenant ID from subdomain or header
        const hostname = window.location.hostname;
        const subdomain = hostname.split('.')[0];
        
        if (subdomain && subdomain !== 'localhost' && subdomain !== 'www') {
          config.headers['x-tenant-id'] = subdomain;
        } else {
          // For localhost development, use demo tenant
          config.headers['x-tenant-id'] = 'demo';
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  // Tenant methods
  async getCurrentTenant() {
    const response = await this.api.get('/tenants/current');
    return response.data;
  }

  // Chat methods
  async startConversation(visitorId: string, visitorInfo?: any) {
    const response = await this.api.post('/chat/conversations', {
      visitorId,
      visitorInfo,
    });
    return response.data;
  }

  async sendMessage(conversationId: string, content: string, senderType: string = 'visitor') {
    const response = await this.api.post(`/chat/conversations/${conversationId}/messages`, {
      content,
      senderType,
    });
    return response.data;
  }

  async getConversationMessages(conversationId: string, limit: number = 50, offset: number = 0) {
    const response = await this.api.get(`/chat/conversations/${conversationId}/messages`, {
      params: { limit, offset },
    });
    return response.data;
  }

  async endConversation(conversationId: string) {
    const response = await this.api.post(`/chat/conversations/${conversationId}/end`);
    return response.data;
  }

  // AI methods
  async sendChatMessage(message: string, conversationId: string, visitorId?: string) {
    const response = await this.api.post('/ai/chat', {
      message,
      conversationId,
      visitorId,
    }, {
      timeout: 45000, // Extended timeout for AI processing (45 seconds)
    });
    return response.data;
  }

  async getWelcomeMessage() {
    const response = await this.api.post('/ai/welcome');
    return response.data;
  }

  async checkAIHealth() {
    const response = await this.api.get('/ai/health');
    return response.data;
  }

  // Lead methods
  async createLead(contactData: any, conversationId?: string) {
    const nameParts = contactData.name.split(' ');
    const leadData = {
      firstName: nameParts[0],
      lastName: nameParts.slice(1).join(' ') || nameParts[0], // Use first name as last name if no last name provided
      email: contactData.email,
      phone: contactData.phone,
      conversationId
    };
    const response = await this.api.post('/leads', leadData);
    return response.data;
  }

  // Auth methods (for dashboard)
  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.api.get('/auth/me');
    return response.data;
  }

  // Set auth token
  setAuthToken(token: string) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Remove auth token
  removeAuthToken() {
    delete this.api.defaults.headers.common['Authorization'];
  }

  // Generic request method
  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.api.request(config);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;