import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Users, 
  Building2, 
  CreditCard, 
  TrendingUp, 
  MessageSquare,
  Calendar,
  Mail,
  AlertCircle,
  Search,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

interface AdminDashboardProps {
  className?: string;
}

interface PlatformStats {
  total_tenants: number;
  active_subscriptions: number;
  trial_subscriptions: number;
  monthly_conversations: number;
  monthly_leads: number;
  monthly_appointments: number;
  monthly_revenue: number;
}

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  subscription_status: string;
  subscription_plan: string;
  trial_ends_at: string | null;
  created_at: string;
  user_count: number;
  conversation_count: number;
  lead_count: number;
}

interface SystemHealth {
  status: 'healthy' | 'unhealthy';
  database: string;
  last_24_hours: {
    conversations: number;
    leads: number;
    appointments: number;
    emails_sent: number;
    email_failures: number;
  };
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ className }) => {
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchDashboardData();
    fetchSystemHealth();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const [dashboardRes, tenantsRes] = await Promise.all([
        fetch('/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`/api/admin/tenants?page=${currentPage}&status=${statusFilter}&plan=${planFilter}&search=${searchTerm}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (dashboardRes.ok && tenantsRes.ok) {
        const dashboardData = await dashboardRes.json();
        const tenantsData = await tenantsRes.json();
        
        setPlatformStats(dashboardData.dashboard.platform_stats);
        setTenants(tenantsData.tenants);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemHealth = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/admin/system/health', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setSystemHealth(data.system_health);
      }
    } catch (error) {
      console.error('Error fetching system health:', error);
    }
  };

  const handleTenantAction = async (tenantId: string, action: 'suspend' | 'activate') => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/admin/tenants/${tenantId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });

      if (response.ok) {
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error(`Error ${action}ing tenant:`, error);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'trialing': return 'bg-blue-100 text-blue-800';
      case 'past_due': return 'bg-yellow-100 text-yellow-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'pro': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading admin dashboard...</span>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Verdict 360 Platform Management</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={fetchSystemHealth}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* System Health Alert */}
      {systemHealth && systemHealth.status === 'unhealthy' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800 font-medium">System Health Warning</span>
          </div>
          <p className="text-red-700 mt-1">
            System status: {systemHealth.database}. Please check logs for details.
          </p>
        </div>
      )}

      {/* Platform Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformStats?.total_tenants || 0}</div>
            <p className="text-xs text-muted-foreground">
              {platformStats?.active_subscriptions || 0} active subscriptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(platformStats?.monthly_revenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {platformStats?.active_subscriptions || 0} active plans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Activity</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformStats?.monthly_conversations || 0}</div>
            <p className="text-xs text-muted-foreground">
              Conversations this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformStats?.monthly_leads || 0}</div>
            <p className="text-xs text-muted-foreground">
              Leads generated this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Health Cards */}
      {systemHealth && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">24h Conversations</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemHealth.last_24_hours.conversations}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">24h Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemHealth.last_24_hours.appointments}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">24h Emails Sent</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemHealth.last_24_hours.emails_sent}</div>
              {systemHealth.last_24_hours.email_failures > 0 && (
                <p className="text-xs text-red-600">
                  {systemHealth.last_24_hours.email_failures} failures
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <div className={`h-3 w-3 rounded-full ${
                systemHealth.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
              }`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{systemHealth.status}</div>
              <p className="text-xs text-muted-foreground">Database: {systemHealth.database}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tenants Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Tenant Management</CardTitle>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search tenants..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="trialing">Trial</option>
                <option value="past_due">Past Due</option>
                <option value="canceled">Canceled</option>
              </select>
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Plans</option>
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Tenant</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Plan</th>
                  <th className="text-left p-2">Users</th>
                  <th className="text-left p-2">Activity</th>
                  <th className="text-left p-2">Created</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((tenant) => (
                  <tr key={tenant.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{tenant.name}</div>
                        <div className="text-gray-500 text-xs">{tenant.subdomain}</div>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge className={getStatusBadgeColor(tenant.subscription_status)}>
                        {tenant.subscription_status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      {tenant.subscription_plan ? (
                        <Badge className={getPlanBadgeColor(tenant.subscription_plan)}>
                          {tenant.subscription_plan}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">No plan</span>
                      )}
                    </td>
                    <td className="p-2">{tenant.user_count}</td>
                    <td className="p-2">
                      <div className="text-xs">
                        <div>{tenant.conversation_count} conversations</div>
                        <div className="text-gray-500">{tenant.lead_count} leads</div>
                      </div>
                    </td>
                    <td className="p-2 text-xs text-gray-500">
                      {new Date(tenant.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      <div className="flex space-x-1">
                        {tenant.subscription_status === 'active' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTenantAction(tenant.id, 'suspend')}
                          >
                            Suspend
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTenantAction(tenant.id, 'activate')}
                          >
                            Activate
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;