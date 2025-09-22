// Demo/seed data initialization for Verdict 360

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  admin_email: string;
  admin_name: string;
  admin_phone: string;
  plan: string;
  status: string;
  trial_days: number;
  max_users: number;
  address: string;
  city: string;
  postal_code: string;
  created_at: string;
}

export interface User {
  id: string;
  tenant_id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface Lead {
  id: string;
  tenant_id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  practice_area: string;
  created_at: string;
  last_contact: string;
}

export interface Conversation {
  id: string;
  tenant_id: string;
  lead_id: string;
  status: string;
  messages_count: number;
  created_at: string;
  last_message_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender: string;
  content: string;
  created_at: string;
}

export const defaultTenants: Tenant[] = [
  {
    id: 'tenant-smith',
    name: 'Smith & Associates',
    subdomain: 'smith',
    admin_email: 'john@smithlaw.co.za',
    admin_name: 'John Smith',
    admin_phone: '+27 11 234 5678',
    plan: 'professional',
    status: 'active',
    trial_days: 0,
    max_users: 8,
    address: '123 Justice Street, Sandton',
    city: 'Johannesburg',
    postal_code: '2196',
    created_at: new Date('2024-12-01').toISOString()
  },
  {
    id: 'tenant-capetown',
    name: 'Cape Town Legal',
    subdomain: 'capetown',
    admin_email: 'info@ctlegal.co.za',
    admin_name: 'Sarah Johnson',
    admin_phone: '+27 21 456 7890',
    plan: 'starter',
    status: 'trial',
    trial_days: 7,
    max_users: 3,
    address: '456 Long Street',
    city: 'Cape Town',
    postal_code: '8001',
    created_at: new Date('2024-12-10').toISOString()
  },
  {
    id: 'tenant-jhb',
    name: 'Johannesburg Associates',
    subdomain: 'jhb',
    admin_email: 'admin@jhblaw.co.za',
    admin_name: 'Michael Brown',
    admin_phone: '+27 11 987 6543',
    plan: 'enterprise',
    status: 'active',
    trial_days: 0,
    max_users: 25,
    address: '789 Corporate Avenue, Rosebank',
    city: 'Johannesburg',
    postal_code: '2196',
    created_at: new Date('2024-11-15').toISOString()
  }
];

export const defaultUsers: User[] = [
  // Smith & Associates users
  { id: 'user-1', tenant_id: 'tenant-smith', name: 'John Smith', email: 'john@smithlaw.co.za', role: 'admin', created_at: new Date('2024-12-01').toISOString() },
  { id: 'user-2', tenant_id: 'tenant-smith', name: 'Jane Doe', email: 'jane@smithlaw.co.za', role: 'attorney', created_at: new Date('2024-12-02').toISOString() },
  { id: 'user-3', tenant_id: 'tenant-smith', name: 'Bob Wilson', email: 'bob@smithlaw.co.za', role: 'paralegal', created_at: new Date('2024-12-03').toISOString() },

  // Cape Town Legal users
  { id: 'user-4', tenant_id: 'tenant-capetown', name: 'Sarah Johnson', email: 'sarah@ctlegal.co.za', role: 'admin', created_at: new Date('2024-12-10').toISOString() },
  { id: 'user-5', tenant_id: 'tenant-capetown', name: 'Tom Davis', email: 'tom@ctlegal.co.za', role: 'attorney', created_at: new Date('2024-12-11').toISOString() },

  // Johannesburg Associates users
  { id: 'user-6', tenant_id: 'tenant-jhb', name: 'Michael Brown', email: 'michael@jhblaw.co.za', role: 'admin', created_at: new Date('2024-11-15').toISOString() },
  { id: 'user-7', tenant_id: 'tenant-jhb', name: 'Lisa Anderson', email: 'lisa@jhblaw.co.za', role: 'attorney', created_at: new Date('2024-11-16').toISOString() },
  { id: 'user-8', tenant_id: 'tenant-jhb', name: 'David Miller', email: 'david@jhblaw.co.za', role: 'attorney', created_at: new Date('2024-11-17').toISOString() }
];

export const defaultLeads: Lead[] = [
  // Smith & Associates leads
  { id: 'lead-1', tenant_id: 'tenant-smith', name: 'Alice Cooper', email: 'alice@example.com', phone: '+27 11 111 1111', status: 'new', source: 'website', practice_area: 'Family Law', created_at: new Date('2024-12-15').toISOString(), last_contact: new Date('2024-12-15').toISOString() },
  { id: 'lead-2', tenant_id: 'tenant-smith', name: 'Bob Marley', email: 'bob@example.com', phone: '+27 11 222 2222', status: 'qualified', source: 'referral', practice_area: 'Criminal Defense', created_at: new Date('2024-12-14').toISOString(), last_contact: new Date('2024-12-16').toISOString() },
  { id: 'lead-3', tenant_id: 'tenant-smith', name: 'Charlie Brown', email: 'charlie@example.com', phone: '+27 11 333 3333', status: 'contacted', source: 'phone', practice_area: 'Corporate Law', created_at: new Date('2024-12-13').toISOString(), last_contact: new Date('2024-12-17').toISOString() },

  // Cape Town Legal leads
  { id: 'lead-4', tenant_id: 'tenant-capetown', name: 'Diana Prince', email: 'diana@example.com', phone: '+27 21 111 1111', status: 'new', source: 'website', practice_area: 'Real Estate', created_at: new Date('2024-12-16').toISOString(), last_contact: new Date('2024-12-16').toISOString() },
  { id: 'lead-5', tenant_id: 'tenant-capetown', name: 'Edward Norton', email: 'edward@example.com', phone: '+27 21 222 2222', status: 'qualified', source: 'email', practice_area: 'Immigration', created_at: new Date('2024-12-15').toISOString(), last_contact: new Date('2024-12-17').toISOString() },

  // Johannesburg Associates leads
  { id: 'lead-6', tenant_id: 'tenant-jhb', name: 'Frank Sinatra', email: 'frank@example.com', phone: '+27 11 444 4444', status: 'converted', source: 'referral', practice_area: 'Tax Law', created_at: new Date('2024-11-20').toISOString(), last_contact: new Date('2024-12-10').toISOString() },
  { id: 'lead-7', tenant_id: 'tenant-jhb', name: 'Grace Kelly', email: 'grace@example.com', phone: '+27 11 555 5555', status: 'qualified', source: 'website', practice_area: 'Labor Law', created_at: new Date('2024-12-01').toISOString(), last_contact: new Date('2024-12-18').toISOString() },
  { id: 'lead-8', tenant_id: 'tenant-jhb', name: 'Henry Ford', email: 'henry@example.com', phone: '+27 11 666 6666', status: 'contacted', source: 'phone', practice_area: 'Personal Injury', created_at: new Date('2024-12-05').toISOString(), last_contact: new Date('2024-12-15').toISOString() }
];

export const defaultConversations: Conversation[] = [
  { id: 'conv-1', tenant_id: 'tenant-smith', lead_id: 'lead-1', status: 'active', messages_count: 5, created_at: new Date('2024-12-15').toISOString(), last_message_at: new Date('2024-12-18T10:30:00').toISOString() },
  { id: 'conv-2', tenant_id: 'tenant-smith', lead_id: 'lead-2', status: 'active', messages_count: 8, created_at: new Date('2024-12-14').toISOString(), last_message_at: new Date('2024-12-18T09:15:00').toISOString() },
  { id: 'conv-3', tenant_id: 'tenant-smith', lead_id: 'lead-3', status: 'closed', messages_count: 12, created_at: new Date('2024-12-13').toISOString(), last_message_at: new Date('2024-12-17T16:45:00').toISOString() },
  { id: 'conv-4', tenant_id: 'tenant-capetown', lead_id: 'lead-4', status: 'active', messages_count: 3, created_at: new Date('2024-12-16').toISOString(), last_message_at: new Date('2024-12-18T11:20:00').toISOString() },
  { id: 'conv-5', tenant_id: 'tenant-capetown', lead_id: 'lead-5', status: 'active', messages_count: 6, created_at: new Date('2024-12-15').toISOString(), last_message_at: new Date('2024-12-17T14:30:00').toISOString() },
  { id: 'conv-6', tenant_id: 'tenant-jhb', lead_id: 'lead-6', status: 'closed', messages_count: 15, created_at: new Date('2024-11-20').toISOString(), last_message_at: new Date('2024-12-10T12:00:00').toISOString() },
  { id: 'conv-7', tenant_id: 'tenant-jhb', lead_id: 'lead-7', status: 'active', messages_count: 4, created_at: new Date('2024-12-01').toISOString(), last_message_at: new Date('2024-12-18T08:45:00').toISOString() },
  { id: 'conv-8', tenant_id: 'tenant-jhb', lead_id: 'lead-8', status: 'active', messages_count: 7, created_at: new Date('2024-12-05').toISOString(), last_message_at: new Date('2024-12-17T17:30:00').toISOString() }
];

export const sampleMessages: Message[] = [
  // Conversation 1 messages
  { id: 'msg-1', conversation_id: 'conv-1', sender: 'lead', content: 'Hi, I need help with a family law matter regarding child custody.', created_at: new Date('2024-12-15T09:00:00').toISOString() },
  { id: 'msg-2', conversation_id: 'conv-1', sender: 'ai', content: 'Hello! I understand you need assistance with a child custody matter. This is an important and sensitive issue. Could you tell me more about your specific situation?', created_at: new Date('2024-12-15T09:01:00').toISOString() },
  { id: 'msg-3', conversation_id: 'conv-1', sender: 'lead', content: 'My ex-spouse and I are having disagreements about our visitation schedule.', created_at: new Date('2024-12-15T09:05:00').toISOString() },
  { id: 'msg-4', conversation_id: 'conv-1', sender: 'ai', content: 'Visitation disputes are common but can be resolved. In South Africa, the Children\'s Act prioritizes the best interests of the child. Would you like to schedule a consultation with one of our family law attorneys?', created_at: new Date('2024-12-15T09:06:00').toISOString() },
  { id: 'msg-5', conversation_id: 'conv-1', sender: 'lead', content: 'Yes, I would like to schedule a consultation please.', created_at: new Date('2024-12-18T10:30:00').toISOString() },

  // Conversation 2 messages
  { id: 'msg-6', conversation_id: 'conv-2', sender: 'lead', content: 'I\'ve been arrested and need legal representation urgently.', created_at: new Date('2024-12-14T14:00:00').toISOString() },
  { id: 'msg-7', conversation_id: 'conv-2', sender: 'ai', content: 'I understand this is an urgent matter. Your right to legal representation is protected under Section 35 of the South African Constitution. Can you tell me what charges you\'re facing?', created_at: new Date('2024-12-14T14:01:00').toISOString() },
  { id: 'msg-8', conversation_id: 'conv-2', sender: 'lead', content: 'It\'s related to a business dispute that escalated.', created_at: new Date('2024-12-14T14:05:00').toISOString() },
  { id: 'msg-9', conversation_id: 'conv-2', sender: 'ai', content: 'I see. Business disputes that lead to criminal charges require immediate attention. One of our criminal defense attorneys can assist you. Are you currently out on bail?', created_at: new Date('2024-12-14T14:06:00').toISOString() }
];

export function initializeSeedData() {
  // Check if data already exists
  const existingTenants = localStorage.getItem('tenants');
  const existingUsers = localStorage.getItem('users');
  const existingLeads = localStorage.getItem('leads');
  const existingConversations = localStorage.getItem('conversations');
  const existingMessages = localStorage.getItem('messages');

  // Only initialize if data doesn't exist
  if (!existingTenants) {
    localStorage.setItem('tenants', JSON.stringify(defaultTenants));
  }
  if (!existingUsers) {
    localStorage.setItem('users', JSON.stringify(defaultUsers));
  }
  if (!existingLeads) {
    localStorage.setItem('leads', JSON.stringify(defaultLeads));
  }
  if (!existingConversations) {
    localStorage.setItem('conversations', JSON.stringify(defaultConversations));
  }
  if (!existingMessages) {
    localStorage.setItem('messages', JSON.stringify(sampleMessages));
  }

  return {
    tenants: JSON.parse(localStorage.getItem('tenants') || '[]'),
    users: JSON.parse(localStorage.getItem('users') || '[]'),
    leads: JSON.parse(localStorage.getItem('leads') || '[]'),
    conversations: JSON.parse(localStorage.getItem('conversations') || '[]'),
    messages: JSON.parse(localStorage.getItem('messages') || '[]')
  };
}

export function clearSeedData() {
  localStorage.removeItem('tenants');
  localStorage.removeItem('users');
  localStorage.removeItem('leads');
  localStorage.removeItem('conversations');
  localStorage.removeItem('messages');
}

export function getTenantById(id: string) {
  const tenants = JSON.parse(localStorage.getItem('tenants') || '[]');
  return tenants.find((t: Tenant) => t.id === id);
}

export function getUsersByTenant(tenantId: string) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  return users.filter((u: User) => u.tenant_id === tenantId);
}

export function getLeadsByTenant(tenantId: string) {
  const leads = JSON.parse(localStorage.getItem('leads') || '[]');
  return leads.filter((l: Lead) => l.tenant_id === tenantId);
}

export function getConversationsByTenant(tenantId: string) {
  const conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
  return conversations.filter((c: Conversation) => c.tenant_id === tenantId);
}

export function getMessagesByConversation(conversationId: string) {
  const messages = JSON.parse(localStorage.getItem('messages') || '[]');
  return messages.filter((m: Message) => m.conversation_id === conversationId);
}