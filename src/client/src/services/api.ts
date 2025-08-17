import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
    
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
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
  async createLead(leadData: any) {
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