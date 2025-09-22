<script lang="ts">
  import { onMount } from 'svelte';
  import Card from '$lib/components/ui/card.svelte';
  import CardHeader from '$lib/components/ui/card-header.svelte';
  import CardTitle from '$lib/components/ui/card-title.svelte';
  import CardContent from '$lib/components/ui/card-content.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import Input from '$lib/components/ui/input.svelte';
  import Label from '$lib/components/ui/label.svelte';
  import Badge from '$lib/components/ui/badge.svelte';
  import { ArrowLeft, Save, User, Bell, Lock, Globe, CreditCard, Palette, MessageSquare } from 'lucide-svelte';

  let user = $state({
    name: '',
    email: '',
    phone: '',
    firmName: '',
    role: '',
    avatar: ''
  });

  let settings = $state({
    profile: {
      name: '',
      email: '',
      phone: '',
      title: '',
      bio: ''
    },
    notifications: {
      email_notifications: true,
      sms_notifications: false,
      lead_alerts: true,
      appointment_reminders: true,
      conversation_summaries: true,
      weekly_reports: true
    },
    chatbot: {
      greeting_message: 'Hello! I\'m here to help with your legal questions. How can I assist you today?',
      response_tone: 'professional',
      auto_collect_leads: true,
      appointment_scheduling: true,
      business_hours_only: false,
      disclaimer_text: 'This is for informational purposes only and does not constitute legal advice.'
    },
    appearance: {
      primary_color: '#3B82F6',
      chat_position: 'bottom-right',
      chat_icon: 'default',
      show_branding: true,
      custom_css: ''
    },
    integrations: {
      google_calendar: false,
      outlook_calendar: false,
      slack: false,
      zapier: false
    },
    billing: {
      plan: 'Professional',
      status: 'active',
      next_billing_date: '2025-01-20',
      payment_method: '•••• 4242'
    }
  });

  let activeTab = 'profile';
  let loading = false;
  let saveStatus = '';
  let passwordData = {
    current: '',
    new: '',
    confirm: ''
  };

  onMount(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      user = JSON.parse(storedUser);
      settings.profile = {
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        title: user.title || '',
        bio: user.bio || ''
      };
    }
    fetchSettings();
  });

  async function fetchSettings() {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/user/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          settings = { ...settings, ...data.settings };
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  }

  async function saveSettings(section: string) {
    loading = true;
    saveStatus = '';

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/user/settings/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings[section])
      });

      if (response.ok) {
        saveStatus = 'Settings saved successfully!';
        if (section === 'profile') {
          localStorage.setItem('user', JSON.stringify({
            ...user,
            ...settings.profile
          }));
        }
        setTimeout(() => saveStatus = '', 3000);
      } else {
        saveStatus = 'Failed to save settings';
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      saveStatus = 'Error saving settings';
    } finally {
      loading = false;
    }
  }

  async function updatePassword() {
    if (passwordData.new !== passwordData.confirm) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.new.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    loading = true;
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: passwordData.current,
          new_password: passwordData.new
        })
      });

      if (response.ok) {
        alert('Password updated successfully!');
        passwordData = { current: '', new: '', confirm: '' };
      } else {
        alert('Failed to update password. Please check your current password.');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Error updating password');
    } finally {
      loading = false;
    }
  }

  async function connectIntegration(integration: string) {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/integrations/${integration}/connect`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.auth_url) {
          window.open(data.auth_url, '_blank');
        } else {
          settings.integrations[integration] = true;
          alert(`${integration} connected successfully!`);
        }
      }
    } catch (error) {
      console.error(`Error connecting ${integration}:`, error);
    }
  }

  function getToneOptions() {
    return [
      { value: 'professional', label: 'Professional' },
      { value: 'friendly', label: 'Friendly' },
      { value: 'formal', label: 'Formal' },
      { value: 'conversational', label: 'Conversational' }
    ];
  }

  function getChatPositionOptions() {
    return [
      { value: 'bottom-right', label: 'Bottom Right' },
      { value: 'bottom-left', label: 'Bottom Left' },
      { value: 'top-right', label: 'Top Right' },
      { value: 'top-left', label: 'Top Left' }
    ];
  }
</script>

<svelte:head>
  <title>Settings - Verdict 360</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <header class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <div class="flex items-center">
        <a href="/dashboard" class="mr-4">
          <ArrowLeft class="h-5 w-5 text-gray-500 hover:text-gray-700" />
        </a>
        <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <div class="flex gap-6">
      <!-- Sidebar -->
      <aside class="w-64 flex-shrink-0">
        <nav class="space-y-1">
          <button
            class="w-full text-left px-3 py-2 text-sm font-medium rounded-md {activeTab === 'profile' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}"
            on:click={() => activeTab = 'profile'}
          >
            <User class="inline-block w-4 h-4 mr-2" />
            Profile
          </button>
          <button
            class="w-full text-left px-3 py-2 text-sm font-medium rounded-md {activeTab === 'notifications' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}"
            on:click={() => activeTab = 'notifications'}
          >
            <Bell class="inline-block w-4 h-4 mr-2" />
            Notifications
          </button>
          <button
            class="w-full text-left px-3 py-2 text-sm font-medium rounded-md {activeTab === 'chatbot' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}"
            on:click={() => activeTab = 'chatbot'}
          >
            <MessageSquare class="inline-block w-4 h-4 mr-2" />
            Chatbot
          </button>
          <button
            class="w-full text-left px-3 py-2 text-sm font-medium rounded-md {activeTab === 'appearance' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}"
            on:click={() => activeTab = 'appearance'}
          >
            <Palette class="inline-block w-4 h-4 mr-2" />
            Appearance
          </button>
          <button
            class="w-full text-left px-3 py-2 text-sm font-medium rounded-md {activeTab === 'security' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}"
            on:click={() => activeTab = 'security'}
          >
            <Lock class="inline-block w-4 h-4 mr-2" />
            Security
          </button>
          <button
            class="w-full text-left px-3 py-2 text-sm font-medium rounded-md {activeTab === 'integrations' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}"
            on:click={() => activeTab = 'integrations'}
          >
            <Globe class="inline-block w-4 h-4 mr-2" />
            Integrations
          </button>
          <button
            class="w-full text-left px-3 py-2 text-sm font-medium rounded-md {activeTab === 'billing' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}"
            on:click={() => activeTab = 'billing'}
          >
            <CreditCard class="inline-block w-4 h-4 mr-2" />
            Billing
          </button>
        </nav>
      </aside>

      <!-- Content -->
      <div class="flex-1">
        {#if saveStatus}
          <div class="mb-4 p-4 rounded-md {saveStatus.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}">
            {saveStatus}
          </div>
        {/if}

        {#if activeTab === 'profile'}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label for="name">Full Name</Label>
                    <Input
                      id="name"
                      bind:value={settings.profile.name}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label for="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      bind:value={settings.profile.email}
                      placeholder="john@lawfirm.com"
                    />
                  </div>
                  <div>
                    <Label for="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      bind:value={settings.profile.phone}
                      placeholder="+27 11 234 5678"
                    />
                  </div>
                  <div>
                    <Label for="title">Job Title</Label>
                    <Input
                      id="title"
                      bind:value={settings.profile.title}
                      placeholder="Senior Partner"
                    />
                  </div>
                </div>
                <div>
                  <Label for="bio">Bio</Label>
                  <textarea
                    id="bio"
                    bind:value={settings.profile.bio}
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows="4"
                    placeholder="Tell us about yourself..."
                  ></textarea>
                </div>
                <Button on:click={() => saveSettings('profile')} disabled={loading}>
                  <Save class="h-4 w-4 mr-2" />
                  Save Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        {/if}

        {#if activeTab === 'notifications'}
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">Email Notifications</p>
                      <p class="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <input
                      type="checkbox"
                      bind:checked={settings.notifications.email_notifications}
                      class="rounded border-gray-300"
                    />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">SMS Notifications</p>
                      <p class="text-sm text-gray-500">Receive notifications via SMS</p>
                    </div>
                    <input
                      type="checkbox"
                      bind:checked={settings.notifications.sms_notifications}
                      class="rounded border-gray-300"
                    />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">Lead Alerts</p>
                      <p class="text-sm text-gray-500">Get notified when new leads are captured</p>
                    </div>
                    <input
                      type="checkbox"
                      bind:checked={settings.notifications.lead_alerts}
                      class="rounded border-gray-300"
                    />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">Appointment Reminders</p>
                      <p class="text-sm text-gray-500">Remind me of upcoming appointments</p>
                    </div>
                    <input
                      type="checkbox"
                      bind:checked={settings.notifications.appointment_reminders}
                      class="rounded border-gray-300"
                    />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">Conversation Summaries</p>
                      <p class="text-sm text-gray-500">Daily summary of chatbot conversations</p>
                    </div>
                    <input
                      type="checkbox"
                      bind:checked={settings.notifications.conversation_summaries}
                      class="rounded border-gray-300"
                    />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">Weekly Reports</p>
                      <p class="text-sm text-gray-500">Weekly performance reports</p>
                    </div>
                    <input
                      type="checkbox"
                      bind:checked={settings.notifications.weekly_reports}
                      class="rounded border-gray-300"
                    />
                  </div>
                </div>
                <Button on:click={() => saveSettings('notifications')} disabled={loading}>
                  <Save class="h-4 w-4 mr-2" />
                  Save Notifications
                </Button>
              </div>
            </CardContent>
          </Card>
        {/if}

        {#if activeTab === 'chatbot'}
          <Card>
            <CardHeader>
              <CardTitle>Chatbot Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div>
                  <Label for="greeting">Greeting Message</Label>
                  <textarea
                    id="greeting"
                    bind:value={settings.chatbot.greeting_message}
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows="3"
                  ></textarea>
                </div>
                <div>
                  <Label for="tone">Response Tone</Label>
                  <select
                    id="tone"
                    bind:value={settings.chatbot.response_tone}
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {#each getToneOptions() as option}
                      <option value={option.value}>{option.label}</option>
                    {/each}
                  </select>
                </div>
                <div>
                  <Label for="disclaimer">Disclaimer Text</Label>
                  <textarea
                    id="disclaimer"
                    bind:value={settings.chatbot.disclaimer_text}
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows="2"
                  ></textarea>
                </div>
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">Auto-collect Leads</p>
                      <p class="text-sm text-gray-500">Automatically capture visitor information</p>
                    </div>
                    <input
                      type="checkbox"
                      bind:checked={settings.chatbot.auto_collect_leads}
                      class="rounded border-gray-300"
                    />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">Appointment Scheduling</p>
                      <p class="text-sm text-gray-500">Allow booking appointments through chat</p>
                    </div>
                    <input
                      type="checkbox"
                      bind:checked={settings.chatbot.appointment_scheduling}
                      class="rounded border-gray-300"
                    />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">Business Hours Only</p>
                      <p class="text-sm text-gray-500">Show chat only during business hours</p>
                    </div>
                    <input
                      type="checkbox"
                      bind:checked={settings.chatbot.business_hours_only}
                      class="rounded border-gray-300"
                    />
                  </div>
                </div>
                <Button on:click={() => saveSettings('chatbot')} disabled={loading}>
                  <Save class="h-4 w-4 mr-2" />
                  Save Chatbot Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        {/if}

        {#if activeTab === 'appearance'}
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div>
                  <Label for="primary-color">Primary Color</Label>
                  <div class="flex gap-2">
                    <Input
                      id="primary-color"
                      type="color"
                      bind:value={settings.appearance.primary_color}
                      class="w-20 h-10"
                    />
                    <Input
                      bind:value={settings.appearance.primary_color}
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>
                <div>
                  <Label for="position">Chat Widget Position</Label>
                  <select
                    id="position"
                    bind:value={settings.appearance.chat_position}
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {#each getChatPositionOptions() as option}
                      <option value={option.value}>{option.label}</option>
                    {/each}
                  </select>
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium">Show Branding</p>
                    <p class="text-sm text-gray-500">Display "Powered by Verdict 360"</p>
                  </div>
                  <input
                    type="checkbox"
                    bind:checked={settings.appearance.show_branding}
                    class="rounded border-gray-300"
                  />
                </div>
                <div>
                  <Label for="custom-css">Custom CSS (Advanced)</Label>
                  <textarea
                    id="custom-css"
                    bind:value={settings.appearance.custom_css}
                    class="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows="6"
                    placeholder=".chat-widget {&#10;  /* Your custom styles */&#10;}"
                  ></textarea>
                </div>
                <Button on:click={() => saveSettings('appearance')} disabled={loading}>
                  <Save class="h-4 w-4 mr-2" />
                  Save Appearance Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        {/if}

        {#if activeTab === 'security'}
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-6">
                <div class="space-y-4">
                  <h3 class="font-medium text-lg">Change Password</h3>
                  <div>
                    <Label for="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      bind:value={passwordData.current}
                    />
                  </div>
                  <div>
                    <Label for="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      bind:value={passwordData.new}
                    />
                  </div>
                  <div>
                    <Label for="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      bind:value={passwordData.confirm}
                    />
                  </div>
                  <Button on:click={updatePassword} disabled={loading}>
                    Update Password
                  </Button>
                </div>

                <div class="border-t pt-6 space-y-4">
                  <h3 class="font-medium text-lg">Two-Factor Authentication</h3>
                  <p class="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>

                <div class="border-t pt-6 space-y-4">
                  <h3 class="font-medium text-lg">Active Sessions</h3>
                  <p class="text-sm text-gray-500">Manage devices where you're signed in</p>
                  <Button variant="outline">View Sessions</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        {/if}

        {#if activeTab === 'integrations'}
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div class="border rounded-lg p-4">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 class="font-medium">Google Calendar</h4>
                        <p class="text-sm text-gray-500">Sync appointments with Google Calendar</p>
                      </div>
                    </div>
                    {#if settings.integrations.google_calendar}
                      <Badge variant="success">Connected</Badge>
                    {:else}
                      <Button size="sm" on:click={() => connectIntegration('google_calendar')}>
                        Connect
                      </Button>
                    {/if}
                  </div>
                </div>

                <div class="border rounded-lg p-4">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                          <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 class="font-medium">Outlook Calendar</h4>
                        <p class="text-sm text-gray-500">Sync appointments with Outlook</p>
                      </div>
                    </div>
                    {#if settings.integrations.outlook_calendar}
                      <Badge variant="success">Connected</Badge>
                    {:else}
                      <Button size="sm" on:click={() => connectIntegration('outlook_calendar')}>
                        Connect
                      </Button>
                    {/if}
                  </div>
                </div>

                <div class="border rounded-lg p-4">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-pink-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M14.5 10.5C14.5 11.3 13.8 12 13 12C12.2 12 11.5 11.3 11.5 10.5C11.5 9.7 12.2 9 13 9C13.8 9 14.5 9.7 14.5 10.5M8.5 10.5C8.5 11.3 7.8 12 7 12S5.5 11.3 5.5 10.5C5.5 9.7 6.2 9 7 9S8.5 9.7 8.5 10.5M21 7C21 5.9 20.1 5 19 5H15L13.5 3.5C13.1 3.1 12.6 3 12.1 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V7Z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 class="font-medium">Slack</h4>
                        <p class="text-sm text-gray-500">Get notifications in Slack</p>
                      </div>
                    </div>
                    {#if settings.integrations.slack}
                      <Badge variant="success">Connected</Badge>
                    {:else}
                      <Button size="sm" on:click={() => connectIntegration('slack')}>
                        Connect
                      </Button>
                    {/if}
                  </div>
                </div>

                <div class="border rounded-lg p-4">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-orange-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 class="font-medium">Zapier</h4>
                        <p class="text-sm text-gray-500">Connect with 5000+ apps</p>
                      </div>
                    </div>
                    {#if settings.integrations.zapier}
                      <Badge variant="success">Connected</Badge>
                    {:else}
                      <Button size="sm" on:click={() => connectIntegration('zapier')}>
                        Connect
                      </Button>
                    {/if}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        {/if}

        {#if activeTab === 'billing'}
          <Card>
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-6">
                <div class="border rounded-lg p-4 bg-primary-50">
                  <div class="flex items-center justify-between mb-4">
                    <div>
                      <h3 class="text-lg font-semibold">{settings.billing.plan} Plan</h3>
                      <Badge variant={settings.billing.status === 'active' ? 'success' : 'warning'}>
                        {settings.billing.status}
                      </Badge>
                    </div>
                    <div class="text-right">
                      <p class="text-2xl font-bold">R1,999</p>
                      <p class="text-sm text-gray-500">per month</p>
                    </div>
                  </div>
                  <div class="text-sm text-gray-600">
                    <p>Next billing date: {settings.billing.next_billing_date}</p>
                    <p>Payment method: Visa {settings.billing.payment_method}</p>
                  </div>
                </div>

                <div class="space-y-3">
                  <h4 class="font-medium">Plan Features</h4>
                  <ul class="space-y-2 text-sm">
                    <li class="flex items-center gap-2">
                      <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Unlimited conversations
                    </li>
                    <li class="flex items-center gap-2">
                      <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Advanced AI responses
                    </li>
                    <li class="flex items-center gap-2">
                      <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Calendar integration
                    </li>
                    <li class="flex items-center gap-2">
                      <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Lead management
                    </li>
                    <li class="flex items-center gap-2">
                      <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Analytics dashboard
                    </li>
                  </ul>
                </div>

                <div class="flex gap-2">
                  <Button variant="outline">Change Plan</Button>
                  <Button variant="outline">Update Payment Method</Button>
                  <Button variant="outline">View Invoices</Button>
                  <Button variant="destructive" variant="outline">Cancel Subscription</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        {/if}
      </div>
    </div>
  </main>
</div>