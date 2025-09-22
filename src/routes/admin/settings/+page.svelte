<script lang="ts">
  import { onMount } from 'svelte';
  import Card from '$lib/components/ui/card.svelte';
  import CardHeader from '$lib/components/ui/card-header.svelte';
  import CardTitle from '$lib/components/ui/card-title.svelte';
  import CardContent from '$lib/components/ui/card-content.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import Input from '$lib/components/ui/input.svelte';
  import Label from '$lib/components/ui/label.svelte';
  import { ArrowLeft, Save, Database, Mail, Globe, Shield, Bell, CreditCard } from 'lucide-svelte';

  let settings = $state({
    platform: {
      name: 'Verdict 360',
      domain: 'verdict360.com',
      support_email: 'support@verdict360.com',
      max_tenants: 100,
      maintenance_mode: false
    },
    email: {
      smtp_host: 'smtp.gmail.com',
      smtp_port: 587,
      smtp_user: 'noreply@verdict360.com',
      smtp_secure: true,
      from_name: 'Verdict 360',
      from_email: 'noreply@verdict360.com'
    },
    ai: {
      model: 'llama3.1',
      endpoint: 'http://localhost:11434',
      max_tokens: 2000,
      temperature: 0.7,
      timeout: 30
    },
    billing: {
      stripe_enabled: true,
      stripe_mode: 'test',
      currency: 'ZAR',
      trial_days: 14,
      webhook_endpoint: '/api/stripe/webhook'
    },
    security: {
      jwt_expiry: '7d',
      refresh_token_expiry: '30d',
      max_login_attempts: 5,
      lockout_duration: 30,
      password_min_length: 8,
      require_2fa: false
    },
    notifications: {
      email_enabled: true,
      sms_enabled: false,
      webhook_enabled: false,
      slack_enabled: false
    }
  });

  let loading = false;
  let saveStatus = '';

  onMount(() => {
    fetchSettings();
  });

  async function fetchSettings() {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/admin/settings', {
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
      const response = await fetch(`/api/admin/settings/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings[section])
      });

      if (response.ok) {
        saveStatus = 'Settings saved successfully!';
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

  async function testEmailConnection() {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/admin/settings/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings.email)
      });

      if (response.ok) {
        alert('Email test successful!');
      } else {
        alert('Email test failed. Check your settings.');
      }
    } catch (error) {
      console.error('Error testing email:', error);
      alert('Error testing email connection');
    }
  }
</script>

<svelte:head>
  <title>Platform Settings - Admin - Verdict 360</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <header class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <div class="flex items-center">
        <a href="/admin" class="mr-4">
          <ArrowLeft class="h-5 w-5 text-gray-500 hover:text-gray-700" />
        </a>
        <h1 class="text-2xl font-bold text-gray-900">Platform Settings</h1>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    {#if saveStatus}
      <div class="mb-4 p-4 rounded-md {saveStatus.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}">
        {saveStatus}
      </div>
    {/if}

    <div class="space-y-6">
      <!-- Platform Settings -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Globe class="h-5 w-5" />
            Platform Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label for="platform-name">Platform Name</Label>
              <Input
                id="platform-name"
                bind:value={settings.platform.name}
                placeholder="Verdict 360"
              />
            </div>
            <div>
              <Label for="platform-domain">Domain</Label>
              <Input
                id="platform-domain"
                bind:value={settings.platform.domain}
                placeholder="verdict360.com"
              />
            </div>
            <div>
              <Label for="support-email">Support Email</Label>
              <Input
                id="support-email"
                type="email"
                bind:value={settings.platform.support_email}
                placeholder="support@verdict360.com"
              />
            </div>
            <div>
              <Label for="max-tenants">Max Tenants</Label>
              <Input
                id="max-tenants"
                type="number"
                bind:value={settings.platform.max_tenants}
              />
            </div>
            <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                id="maintenance-mode"
                bind:checked={settings.platform.maintenance_mode}
                class="rounded border-gray-300"
              />
              <Label for="maintenance-mode">Maintenance Mode</Label>
            </div>
          </div>
          <div class="mt-4">
            <Button on:click={() => saveSettings('platform')} disabled={loading}>
              <Save class="h-4 w-4 mr-2" />
              Save Platform Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Email Settings -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Mail class="h-5 w-5" />
            Email Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label for="smtp-host">SMTP Host</Label>
              <Input
                id="smtp-host"
                bind:value={settings.email.smtp_host}
                placeholder="smtp.gmail.com"
              />
            </div>
            <div>
              <Label for="smtp-port">SMTP Port</Label>
              <Input
                id="smtp-port"
                type="number"
                bind:value={settings.email.smtp_port}
                placeholder="587"
              />
            </div>
            <div>
              <Label for="smtp-user">SMTP User</Label>
              <Input
                id="smtp-user"
                bind:value={settings.email.smtp_user}
                placeholder="noreply@verdict360.com"
              />
            </div>
            <div>
              <Label for="from-email">From Email</Label>
              <Input
                id="from-email"
                type="email"
                bind:value={settings.email.from_email}
                placeholder="noreply@verdict360.com"
              />
            </div>
            <div>
              <Label for="from-name">From Name</Label>
              <Input
                id="from-name"
                bind:value={settings.email.from_name}
                placeholder="Verdict 360"
              />
            </div>
            <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                id="smtp-secure"
                bind:checked={settings.email.smtp_secure}
                class="rounded border-gray-300"
              />
              <Label for="smtp-secure">Use TLS/SSL</Label>
            </div>
          </div>
          <div class="mt-4 flex gap-2">
            <Button on:click={() => saveSettings('email')} disabled={loading}>
              <Save class="h-4 w-4 mr-2" />
              Save Email Settings
            </Button>
            <Button variant="outline" on:click={testEmailConnection}>
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- AI Settings -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Database class="h-5 w-5" />
            AI Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label for="ai-model">Model</Label>
              <Input
                id="ai-model"
                bind:value={settings.ai.model}
                placeholder="llama3.1"
              />
            </div>
            <div>
              <Label for="ai-endpoint">Endpoint URL</Label>
              <Input
                id="ai-endpoint"
                bind:value={settings.ai.endpoint}
                placeholder="http://localhost:11434"
              />
            </div>
            <div>
              <Label for="max-tokens">Max Tokens</Label>
              <Input
                id="max-tokens"
                type="number"
                bind:value={settings.ai.max_tokens}
              />
            </div>
            <div>
              <Label for="temperature">Temperature</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                bind:value={settings.ai.temperature}
              />
            </div>
            <div>
              <Label for="timeout">Timeout (seconds)</Label>
              <Input
                id="timeout"
                type="number"
                bind:value={settings.ai.timeout}
              />
            </div>
          </div>
          <div class="mt-4">
            <Button on:click={() => saveSettings('ai')} disabled={loading}>
              <Save class="h-4 w-4 mr-2" />
              Save AI Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Billing Settings -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <CreditCard class="h-5 w-5" />
            Billing Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                id="stripe-enabled"
                bind:checked={settings.billing.stripe_enabled}
                class="rounded border-gray-300"
              />
              <Label for="stripe-enabled">Stripe Enabled</Label>
            </div>
            <div>
              <Label for="stripe-mode">Mode</Label>
              <select
                id="stripe-mode"
                bind:value={settings.billing.stripe_mode}
                class="w-full rounded-md border-gray-300"
              >
                <option value="test">Test</option>
                <option value="live">Live</option>
              </select>
            </div>
            <div>
              <Label for="currency">Currency</Label>
              <Input
                id="currency"
                bind:value={settings.billing.currency}
                placeholder="ZAR"
              />
            </div>
            <div>
              <Label for="trial-days">Trial Days</Label>
              <Input
                id="trial-days"
                type="number"
                bind:value={settings.billing.trial_days}
              />
            </div>
          </div>
          <div class="mt-4">
            <Button on:click={() => saveSettings('billing')} disabled={loading}>
              <Save class="h-4 w-4 mr-2" />
              Save Billing Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Security Settings -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Shield class="h-5 w-5" />
            Security Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label for="jwt-expiry">JWT Expiry</Label>
              <Input
                id="jwt-expiry"
                bind:value={settings.security.jwt_expiry}
                placeholder="7d"
              />
            </div>
            <div>
              <Label for="refresh-expiry">Refresh Token Expiry</Label>
              <Input
                id="refresh-expiry"
                bind:value={settings.security.refresh_token_expiry}
                placeholder="30d"
              />
            </div>
            <div>
              <Label for="max-attempts">Max Login Attempts</Label>
              <Input
                id="max-attempts"
                type="number"
                bind:value={settings.security.max_login_attempts}
              />
            </div>
            <div>
              <Label for="lockout">Lockout Duration (min)</Label>
              <Input
                id="lockout"
                type="number"
                bind:value={settings.security.lockout_duration}
              />
            </div>
            <div>
              <Label for="password-length">Min Password Length</Label>
              <Input
                id="password-length"
                type="number"
                bind:value={settings.security.password_min_length}
              />
            </div>
            <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                id="require-2fa"
                bind:checked={settings.security.require_2fa}
                class="rounded border-gray-300"
              />
              <Label for="require-2fa">Require 2FA</Label>
            </div>
          </div>
          <div class="mt-4">
            <Button on:click={() => saveSettings('security')} disabled={loading}>
              <Save class="h-4 w-4 mr-2" />
              Save Security Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Notification Settings -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Bell class="h-5 w-5" />
            Notification Channels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                id="email-enabled"
                bind:checked={settings.notifications.email_enabled}
                class="rounded border-gray-300"
              />
              <Label for="email-enabled">Email Notifications</Label>
            </div>
            <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                id="sms-enabled"
                bind:checked={settings.notifications.sms_enabled}
                class="rounded border-gray-300"
              />
              <Label for="sms-enabled">SMS Notifications</Label>
            </div>
            <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                id="webhook-enabled"
                bind:checked={settings.notifications.webhook_enabled}
                class="rounded border-gray-300"
              />
              <Label for="webhook-enabled">Webhooks</Label>
            </div>
            <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                id="slack-enabled"
                bind:checked={settings.notifications.slack_enabled}
                class="rounded border-gray-300"
              />
              <Label for="slack-enabled">Slack Integration</Label>
            </div>
          </div>
          <div class="mt-4">
            <Button on:click={() => saveSettings('notifications')} disabled={loading}>
              <Save class="h-4 w-4 mr-2" />
              Save Notification Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </main>
</div>