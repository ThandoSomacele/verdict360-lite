export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  tenantId?: string;
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  intent?: string;
  shouldOfferConsultation?: boolean;
  isDataCollection?: boolean;
  suggestedActions?: string[];
  tenantId?: string;
  timestamp?: string;
}

export interface AIResponse {
  response: string;
  metadata: MessageMetadata;
}

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  email?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'suspended';
  branding: TenantBranding;
  settings: TenantSettings;
  created_at: Date;
  updated_at: Date;
}

export interface TenantBranding {
  companyName: string;
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
  welcomeMessage?: string;
}

export interface TenantSettings {
  businessHours: {
    timezone: string;
    workingDays: string[];
    startTime: string;
    endTime: string;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
  };
  aiModel?: string;
  maxMessagesPerDay?: number;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  company?: string;
  message?: string;
}

export interface Consultation {
  id: string;
  tenantId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  scheduledTime: Date;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
  created_at: Date;
  updated_at: Date;
}