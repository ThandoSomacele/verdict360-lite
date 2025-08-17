export interface Message {
  id: string;
  conversationId: string;
  senderType: 'visitor' | 'bot' | 'attorney';
  senderId: string | null;
  senderName: string | null;
  content: string;
  metadata: any;
  sentAt: string;
}

export interface Conversation {
  id: string;
  tenantId: string;
  visitorId: string;
  status: 'active' | 'completed' | 'abandoned';
  messages?: Message[];
  startedAt: string;
  endedAt?: string;
}

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  customDomain?: string;
  branding: {
    primaryColor?: string;
    secondaryColor?: string;
    logo?: string;
    companyName?: string;
    welcomeMessage?: string;
  };
  settings: {
    businessHours?: any;
    practiceAreas?: string[];
    autoResponse?: boolean;
    leadNotifications?: boolean;
  };
  status: string;
  subscriptionStatus: string;
}

export interface ChatState {
  isConnected: boolean;
  isTyping: boolean;
  conversation: Conversation | null;
  messages: Message[];
  tenant: Tenant | null;
}

export interface ChatWidgetProps {
  tenantId?: string;
  visitorId?: string;
  position?: 'bottom-right' | 'bottom-left';
  theme?: 'light' | 'dark';
  customStyles?: Record<string, any>;
}

export interface AIResponse {
  response: string;
  metadata: {
    intent: string;
    shouldOfferConsultation: boolean;
    isDataCollection: boolean;
    confidenceScore: number;
    suggestedActions: string[];
  };
  conversationId: string;
  timestamp: string;
}