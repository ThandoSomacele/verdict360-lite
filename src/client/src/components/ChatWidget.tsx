import React, { useState, useEffect, useRef } from 'react';
import { Message, Conversation, Tenant, ChatWidgetProps } from '../types';
import { apiService } from '../services/api';
import { socketService } from '../services/socket';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import './ChatWidget.css';

const ChatWidget: React.FC<ChatWidgetProps> = ({
  tenantId,
  visitorId,
  position = 'bottom-right',
  theme = 'light',
  customStyles = {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentVisitorId = useRef<string>(visitorId || `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat when widget opens
  useEffect(() => {
    if (isOpen && !isConnected) {
      initializeChat();
    }
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      socketService.disconnect();
    };
  }, []);

  const initializeChat = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Connect to socket
      await socketService.connect();
      
      // Set up socket event handlers
      socketService.setEventHandlers({
        onConnect: () => {
          console.log('✅ Socket connected');
          setIsConnected(true);
        },
        onDisconnect: () => {
          console.log('❌ Socket disconnected');
          setIsConnected(false);
        },
        onMessage: (message: Message) => {
          setMessages(prev => [...prev, message]);
          setIsTyping(false);
        },
        onTypingStart: (data) => {
          setIsTyping(true);
          setTypingUser(data.senderName);
        },
        onTypingStop: () => {
          setIsTyping(false);
          setTypingUser(null);
        },
        onConversationJoined: (data) => {
          setConversation(data);
          if (data.messages) {
            setMessages(data.messages);
          }
        },
        onError: (error) => {
          console.error('Socket error:', error);
          setError(error.message);
        },
      });

      // Get tenant information
      const tenantData = await apiService.getCurrentTenant();
      setTenant(tenantData);

      // Join tenant context
      socketService.joinTenant(tenantData.id, currentVisitorId.current);

      // Start or join conversation
      await startConversation();

    } catch (error) {
      console.error('Failed to initialize chat:', error);
      setError('Failed to connect to chat service');
    } finally {
      setIsLoading(false);
    }
  };

  const startConversation = async () => {
    try {
      // Start new conversation
      const conversationData = await apiService.startConversation(currentVisitorId.current, {
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        url: window.location.href,
      });

      // Join conversation via socket
      socketService.joinConversation(conversationData.id, currentVisitorId.current);

      // Get welcome message
      const welcomeResponse = await apiService.getWelcomeMessage();
      
      // Add welcome message to conversation
      const welcomeMessage: Message = {
        id: `welcome_${Date.now()}`,
        conversationId: conversationData.id,
        senderType: 'bot',
        senderId: null,
        senderName: 'Legal Assistant',
        content: welcomeResponse.response,
        metadata: welcomeResponse.metadata,
        sentAt: new Date().toISOString(),
      };

      setMessages([welcomeMessage]);

    } catch (error) {
      console.error('Failed to start conversation:', error);
      setError('Failed to start conversation');
    }
  };

  const sendMessage = async (content: string) => {
    if (!conversation || !content.trim()) return;

    try {
      setIsLoading(true);

      // Add user message to UI immediately
      const userMessage: Message = {
        id: `user_${Date.now()}`,
        conversationId: conversation.id,
        senderType: 'visitor',
        senderId: currentVisitorId.current,
        senderName: null,
        content: content.trim(),
        metadata: {},
        sentAt: new Date().toISOString(),
      };

      setMessages(prev => [...prev, userMessage]);

      // Send message via socket for real-time updates
      socketService.sendVisitorMessage(content.trim());

      // Send to AI service for processing
      const aiResponse = await apiService.sendChatMessage(
        content.trim(),
        conversation.id,
        currentVisitorId.current
      );

      // AI response will come through socket, no need to add here

    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTyping = (isTyping: boolean) => {
    if (!conversation) return;

    if (isTyping) {
      socketService.startTyping(conversation.id);
    } else {
      socketService.stopTyping(conversation.id);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const closeChat = () => {
    setIsOpen(false);
    if (conversation) {
      socketService.endConversation(conversation.id);
    }
  };

  const widgetPosition = position === 'bottom-left' ? 'bottom-4 left-4' : 'bottom-4 right-4';
  const themeClasses = theme === 'dark' ? 'dark' : '';

  return (
    <div className={`fixed ${widgetPosition} z-50 ${themeClasses}`} style={customStyles}>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className={`
            w-16 h-16 rounded-full shadow-lg flex items-center justify-center
            transition-all duration-300 hover:scale-110
            ${tenant?.branding?.primaryColor 
              ? `bg-[${tenant.branding.primaryColor}]` 
              : 'bg-blue-600'
            }
            text-white hover:shadow-xl
          `}
          aria-label="Open chat"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          {/* Notification badge */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`
            w-96 h-[32rem] bg-white rounded-lg shadow-2xl border
            flex flex-col overflow-hidden
            ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'border-gray-200'}
            animate-slide-up
          `}
        >
          {/* Header */}
          <ChatHeader
            tenant={tenant}
            isConnected={isConnected}
            onClose={closeChat}
            theme={theme}
          />

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded">
                {error}
                <button
                  onClick={() => setError(null)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            )}

            {isLoading && messages.length === 0 && (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}

            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                tenant={tenant}
                theme={theme}
              />
            ))}

            {isTyping && (
              <TypingIndicator
                user={typingUser || 'Legal Assistant'}
                theme={theme}
              />
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <MessageInput
            onSendMessage={sendMessage}
            onTyping={handleTyping}
            disabled={isLoading || !isConnected}
            theme={theme}
            placeholder="Type your legal question..."
          />
        </div>
      )}
    </div>
  );
};

export default ChatWidget;