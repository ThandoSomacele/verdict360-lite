import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  MessageSquare, 
  Users, 
  Calendar, 
  Mail,
  TrendingUp,
  Settings,
  CreditCard,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  UserPlus,
  BarChart3,
  RefreshCw
} from 'lucide-react';

interface TenantDashboardProps {
  className?: string;
}

interface DashboardStats {
  monthly_stats: {
    conversations: number;
    leads: number;
    appointments: number;
    emails_sent: number;
    conversion_rate: number;
    appointment_rate: number;
  };
  total_stats: {
    conversations: number;
    leads: number;
    appointments: number;
    users: number;
  };
  integrations: {
    calendar_connected: boolean;
    email_configured: boolean;
    billing_active: boolean;
  };
  subscription: {
    status: string;
    plan: string | null;
    trial_ends_at: string | null;
  };
}

interface RecentConversation {
  id: string;
  visitor_id: string;
  status: string;
  message_count: number;
  created_at: string;
  updated_at: string;
  last_message: {
    content: string;
    sender_type: string;
    created_at: string;
  } | null;
}

interface RecentLead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  legal_issue: string;
  status: string;
  source: string;
  created_at: string;
}

interface UpcomingAppointment {
  id: string;
  client_name: string;
  client_email: string;
  legal_issue: string;
  start_time: string;
  status: string;
  meeting_link: string | null;
}

const TenantDashboard: React.FC<TenantDashboardProps> = ({ className }) => {
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [recentConversations, setRecentConversations] = useState<RecentConversation[]>([]);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const [overviewRes, conversationsRes, leadsRes, appointmentsRes] = await Promise.all([
        fetch('/api/dashboard/overview', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/dashboard/conversations/recent?limit=5', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/dashboard/leads/recent?limit=5', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/dashboard/appointments/upcoming?limit=5', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (overviewRes.ok && conversationsRes.ok && leadsRes.ok && appointmentsRes.ok) {
        const [overview, conversations, leads, appointments] = await Promise.all([
          overviewRes.json(),
          conversationsRes.json(),
          leadsRes.json(),
          appointmentsRes.json()
        ]);

        setDashboardData(overview.dashboard);
        setRecentConversations(conversations.conversations);
        setRecentLeads(leads.leads);
        setUpcomingAppointments(appointments.appointments);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'trialing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'new': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'contacted': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-ZA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back to your Verdict 360 dashboard</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={fetchDashboardData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <BarChart3 className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
        </div>
      </div>

      {/* Subscription Status Alert */}
      {dashboardData?.subscription.status === 'trialing' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <span className="text-blue-800 font-medium">Free Trial Active</span>
                {dashboardData.subscription.trial_ends_at && (
                  <p className="text-blue-700 text-sm">
                    Trial ends on {formatDate(dashboardData.subscription.trial_ends_at)}
                  </p>
                )}
              </div>
            </div>
            <Button size="sm">
              <CreditCard className="h-4 w-4 mr-2" />
              Upgrade Now
            </Button>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.monthly_stats.conversations || 0}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData?.monthly_stats.conversion_rate || 0}% conversion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Leads</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.monthly_stats.leads || 0}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData?.monthly_stats.appointment_rate || 0}% become appointments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.monthly_stats.appointments || 0}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.monthly_stats.emails_sent || 0}</div>
            <p className="text-xs text-muted-foreground">
              Automated notifications
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Integration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                <span>Google Calendar</span>
              </div>
              {dashboardData?.integrations.calendar_connected ? (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-800">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Not Connected
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-green-600" />
                <span>Email Service</span>
              </div>
              {dashboardData?.integrations.email_configured ? (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Inactive
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-purple-600" />
                <span>Billing System</span>
              </div>
              {dashboardData?.integrations.billing_active ? (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              ) : (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Setup Required
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="conversations" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="conversations">Recent Conversations</TabsTrigger>
              <TabsTrigger value="leads">Recent Leads</TabsTrigger>
              <TabsTrigger value="appointments">Upcoming Appointments</TabsTrigger>
            </TabsList>

            <TabsContent value="conversations" className="p-6">
              <div className="space-y-4">
                {recentConversations.length > 0 ? (
                  recentConversations.map((conversation) => (
                    <div key={conversation.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusBadgeColor(conversation.status)}>
                              {conversation.status}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {conversation.message_count} messages
                            </span>
                          </div>
                          {conversation.last_message && (
                            <p className="text-sm text-gray-600 mt-2">
                              {truncateText(conversation.last_message.content)}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {formatDate(conversation.updated_at)}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatTime(conversation.updated_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No recent conversations</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="leads" className="p-6">
              <div className="space-y-4">
                {recentLeads.length > 0 ? (
                  recentLeads.map((lead) => (
                    <div key={lead.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium">
                              {lead.first_name} {lead.last_name}
                            </span>
                            <Badge className={getStatusBadgeColor(lead.status)}>
                              {lead.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{lead.email}</p>
                          {lead.phone && (
                            <p className="text-sm text-gray-600">{lead.phone}</p>
                          )}
                          <p className="text-sm text-gray-700 mt-2">
                            {truncateText(lead.legal_issue)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {formatDate(lead.created_at)}
                          </p>
                          <Badge variant="outline" className="mt-1">
                            {lead.source}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No recent leads</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="appointments" className="p-6">
              <div className="space-y-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium">{appointment.client_name}</span>
                            <Badge className={getStatusBadgeColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{appointment.client_email}</p>
                          <p className="text-sm text-gray-700 mt-2">
                            {truncateText(appointment.legal_issue)}
                          </p>
                          {appointment.meeting_link && (
                            <Button size="sm" variant="outline" className="mt-2">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Join Meeting
                            </Button>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {formatDate(appointment.start_time)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatTime(appointment.start_time)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button className="h-20 flex-col space-y-2">
          <Settings className="h-6 w-6" />
          <span>Customize Chatbot</span>
        </Button>
        
        <Button variant="outline" className="h-20 flex-col space-y-2">
          <Calendar className="h-6 w-6" />
          <span>Connect Calendar</span>
        </Button>
        
        <Button variant="outline" className="h-20 flex-col space-y-2">
          <TrendingUp className="h-6 w-6" />
          <span>View Analytics</span>
        </Button>
        
        <Button variant="outline" className="h-20 flex-col space-y-2">
          <ExternalLink className="h-6 w-6" />
          <span>Widget Setup</span>
        </Button>
      </div>
    </div>
  );
};

export default TenantDashboard;