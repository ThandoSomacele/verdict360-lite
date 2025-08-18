import { io, Socket } from 'socket.io-client';
import { Message } from '../types';

export interface SocketEventHandlers {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onMessage?: (message: Message) => void;
  onTypingStart?: (data: { senderId: string; senderName: string }) => void;
  onTypingStop?: (data: { senderId: string }) => void;
  onConversationJoined?: (data: any) => void;
  onConversationEnded?: (data: { conversationId: string; endedAt: string }) => void;
  onError?: (error: { message: string }) => void;
}

class SocketService {
  private socket: Socket | null = null;
  private handlers: SocketEventHandlers = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(serverUrl: string = 'http://localhost:4000'): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(serverUrl, {
          transports: ['websocket'],
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: this.maxReconnectAttempts,
          reconnectionDelay: 1000,
        });

        this.setupEventListeners();

        this.socket.on('connect', () => {
          console.log('🔌 Socket connected:', this.socket?.id);
          this.reconnectAttempts = 0;
          this.handlers.onConnect?.();
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('❌ Socket connection error:', error);
          reject(error);
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
      this.handlers.onDisconnect?.();
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔌 Socket reconnected after', attemptNumber, 'attempts');
      this.reconnectAttempts = 0;
    });

    this.socket.on('reconnect_error', () => {
      this.reconnectAttempts++;
      console.log(`🔌 Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} failed`);
    });

    this.socket.on('message', (message: Message) => {
      console.log('💬 Received message:', message);
      this.handlers.onMessage?.(message);
    });

    this.socket.on('typing_start', (data) => {
      this.handlers.onTypingStart?.(data);
    });

    this.socket.on('typing_stop', (data) => {
      this.handlers.onTypingStop?.(data);
    });

    this.socket.on('conversation_joined', (data) => {
      console.log('💬 Conversation joined:', data);
      this.handlers.onConversationJoined?.(data);
    });

    this.socket.on('conversation_ended', (data) => {
      console.log('💬 Conversation ended:', data);
      this.handlers.onConversationEnded?.(data);
    });

    this.socket.on('error', (error) => {
      console.error('🚨 Socket error:', error);
      this.handlers.onError?.(error);
    });
  }

  setEventHandlers(handlers: SocketEventHandlers) {
    this.handlers = { ...this.handlers, ...handlers };
  }

  joinTenant(tenantId: string, visitorId: string) {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    console.log('🏢 Joining tenant:', tenantId);
    this.socket.emit('join_tenant', { tenantId, visitorId });
  }

  joinConversation(conversationId?: string, visitorId?: string) {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    console.log('💬 Joining conversation:', conversationId);
    this.socket.emit('join_conversation', { conversationId, visitorId });
  }

  sendVisitorMessage(content: string, metadata?: any) {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    console.log('📤 Sending visitor message:', content);
    this.socket.emit('visitor_message', { content, metadata });
  }

  sendAttorneyMessage(content: string, conversationId: string, token: string, metadata?: any) {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    console.log('📤 Sending attorney message:', content);
    this.socket.emit('attorney_message', { content, conversationId, token, metadata });
  }

  startTyping(conversationId: string) {
    if (!this.socket?.connected) return;
    this.socket.emit('typing_start', { conversationId });
  }

  stopTyping(conversationId: string) {
    if (!this.socket?.connected) return;
    this.socket.emit('typing_stop', { conversationId });
  }

  endConversation(conversationId: string) {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    console.log('🔚 Ending conversation:', conversationId);
    this.socket.emit('end_conversation', { conversationId });
  }

  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting socket');
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocketId(): string | undefined {
    return this.socket?.id;
  }
}

export const socketService = new SocketService();
export default socketService;