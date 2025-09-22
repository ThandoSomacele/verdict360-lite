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
  import { ArrowLeft, Save, Brain, MessageSquare, Zap, Shield, RefreshCw, AlertCircle } from 'lucide-svelte';

  let aiSettings = $state({
    model: {
      provider: 'ollama',
      name: 'llama3.1',
      endpoint: 'http://localhost:11434',
      temperature: 0.7,
      max_tokens: 2000,
      context_window: 4096
    },
    personality: {
      tone: 'professional',
      language: 'en',
      greeting: "Hello! I'm your AI legal assistant. How can I help you today?",
      farewell: "Thank you for using our services. If you need further assistance, I'm here to help!",
      disclaimer: "Please note that this is for informational purposes only and does not constitute legal advice."
    },
    knowledge: {
      specialized_areas: ['contract', 'divorce', 'property', 'business', 'labour'],
      jurisdiction: 'south-africa',
      legal_updates: true,
      citation_style: 'standard'
    },
    behavior: {
      auto_suggest_appointment: true,
      collect_contact_info: true,
      escalate_complex_queries: true,
      max_conversation_length: 50,
      typing_indicator: true,
      response_delay: 500
    },
    training: {
      custom_responses: [],
      blocked_topics: [],
      priority_topics: []
    },
    performance: {
      avg_response_time: '1.2s',
      accuracy_rate: 94,
      satisfaction_score: 4.5,
      total_conversations: 1234
    }
  });

  let testQuery = '';
  let testResponse = '';
  let testing = false;
  let saving = false;
  let saveStatus = '';

  let customResponses = $state([
    { trigger: 'office hours', response: 'Our office hours are Monday to Friday, 8:30 AM to 5:00 PM.' },
    { trigger: 'consultation fee', response: 'Initial consultations are R500 for 30 minutes.' },
    { trigger: 'location', response: 'We are located at 123 Legal Street, Sandton, Johannesburg.' }
  ]);

  let blockedTopics = $state(['medical advice', 'financial investment', 'criminal defense']);
  let newBlockedTopic = '';
  let newCustomTrigger = '';
  let newCustomResponse = '';

  onMount(() => {
    fetchAISettings();
  });

  async function fetchAISettings() {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/ai/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          aiSettings = { ...aiSettings, ...data.settings };
          customResponses = data.customResponses || customResponses;
          blockedTopics = data.blockedTopics || blockedTopics;
        }
      }
    } catch (error) {
      console.error('Error fetching AI settings:', error);
    }
  }

  async function saveAISettings() {
    saving = true;
    saveStatus = '';

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/ai/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...aiSettings,
          customResponses,
          blockedTopics
        })
      });

      if (response.ok) {
        saveStatus = 'Settings saved successfully!';
        setTimeout(() => saveStatus = '', 3000);
      } else {
        saveStatus = 'Failed to save settings';
      }
    } catch (error) {
      console.error('Error saving AI settings:', error);
      saveStatus = 'Error saving settings';
    } finally {
      saving = false;
    }
  }

  async function testAI() {
    if (!testQuery) return;

    testing = true;
    testResponse = '';

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/ai/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ query: testQuery })
      });

      if (response.ok) {
        const data = await response.json();
        testResponse = data.response || 'I can help you with various legal matters including contracts, property law, divorce proceedings, and business registration in South Africa. What specific area would you like to know more about?';
      } else {
        testResponse = 'Failed to get AI response. Please check your settings.';
      }
    } catch (error) {
      console.error('Error testing AI:', error);
      testResponse = 'Error: Could not connect to AI service.';
    } finally {
      testing = false;
    }
  }

  async function retrainModel() {
    if (!confirm('This will retrain the AI model with your current settings and custom responses. Continue?')) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/ai/retrain', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        alert('AI model retraining initiated. This may take a few minutes.');
      }
    } catch (error) {
      console.error('Error retraining model:', error);
      alert('Failed to initiate retraining');
    }
  }

  function addCustomResponse() {
    if (newCustomTrigger && newCustomResponse) {
      customResponses = [...customResponses, {
        trigger: newCustomTrigger,
        response: newCustomResponse
      }];
      newCustomTrigger = '';
      newCustomResponse = '';
    }
  }

  function removeCustomResponse(index: number) {
    customResponses = customResponses.filter((_, i) => i !== index);
  }

  function addBlockedTopic() {
    if (newBlockedTopic && !blockedTopics.includes(newBlockedTopic)) {
      blockedTopics = [...blockedTopics, newBlockedTopic];
      newBlockedTopic = '';
    }
  }

  function removeBlockedTopic(topic: string) {
    blockedTopics = blockedTopics.filter(t => t !== topic);
  }

  function getToneOptions() {
    return [
      { value: 'professional', label: 'Professional' },
      { value: 'friendly', label: 'Friendly' },
      { value: 'formal', label: 'Formal' },
      { value: 'conversational', label: 'Conversational' },
      { value: 'empathetic', label: 'Empathetic' }
    ];
  }

  function getModelOptions() {
    return [
      { value: 'llama3.1', label: 'Llama 3.1 (Recommended)' },
      { value: 'llama3.2', label: 'Llama 3.2 (Latest)' },
      { value: 'mistral', label: 'Mistral 7B' },
      { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
      { value: 'gpt-4', label: 'GPT-4' }
    ];
  }
</script>

<svelte:head>
  <title>AI Settings - Dashboard - Verdict 360</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <header class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <a href="/dashboard" class="mr-4">
            <ArrowLeft class="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </a>
          <h1 class="text-2xl font-bold text-gray-900">AI Settings</h1>
        </div>
        <Button variant="outline" on:click={retrainModel}>
          <RefreshCw class="h-4 w-4 mr-2" />
          Retrain Model
        </Button>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    {#if saveStatus}
      <div class="mb-4 p-4 rounded-md {saveStatus.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}">
        {saveStatus}
      </div>
    {/if}

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <!-- Model Configuration -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Brain class="h-5 w-5" />
              Model Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div>
                <Label for="model">AI Model</Label>
                <select
                  id="model"
                  bind:value={aiSettings.model.name}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {#each getModelOptions() as option}
                    <option value={option.value}>{option.label}</option>
                  {/each}
                </select>
              </div>

              <div>
                <Label for="endpoint">API Endpoint</Label>
                <Input
                  id="endpoint"
                  bind:value={aiSettings.model.endpoint}
                  placeholder="http://localhost:11434"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <Label for="temperature">Temperature</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    bind:value={aiSettings.model.temperature}
                  />
                </div>
                <div>
                  <Label for="max-tokens">Max Tokens</Label>
                  <Input
                    id="max-tokens"
                    type="number"
                    bind:value={aiSettings.model.max_tokens}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Personality & Tone -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <MessageSquare class="h-5 w-5" />
              Personality & Tone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div>
                <Label for="tone">Conversation Tone</Label>
                <select
                  id="tone"
                  bind:value={aiSettings.personality.tone}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {#each getToneOptions() as option}
                    <option value={option.value}>{option.label}</option>
                  {/each}
                </select>
              </div>

              <div>
                <Label for="greeting">Greeting Message</Label>
                <textarea
                  id="greeting"
                  bind:value={aiSettings.personality.greeting}
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                ></textarea>
              </div>

              <div>
                <Label for="disclaimer">Legal Disclaimer</Label>
                <textarea
                  id="disclaimer"
                  bind:value={aiSettings.personality.disclaimer}
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                ></textarea>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Behavior Settings -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Zap class="h-5 w-5" />
              Behavior Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium">Auto-suggest Appointments</p>
                  <p class="text-sm text-gray-500">Proactively suggest booking appointments</p>
                </div>
                <input
                  type="checkbox"
                  bind:checked={aiSettings.behavior.auto_suggest_appointment}
                  class="rounded border-gray-300"
                />
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium">Collect Contact Information</p>
                  <p class="text-sm text-gray-500">Automatically capture lead information</p>
                </div>
                <input
                  type="checkbox"
                  bind:checked={aiSettings.behavior.collect_contact_info}
                  class="rounded border-gray-300"
                />
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium">Escalate Complex Queries</p>
                  <p class="text-sm text-gray-500">Flag conversations that need human review</p>
                </div>
                <input
                  type="checkbox"
                  bind:checked={aiSettings.behavior.escalate_complex_queries}
                  class="rounded border-gray-300"
                />
              </div>

              <div>
                <Label for="max-length">Max Conversation Length</Label>
                <Input
                  id="max-length"
                  type="number"
                  bind:value={aiSettings.behavior.max_conversation_length}
                />
              </div>

              <div>
                <Label for="response-delay">Response Delay (ms)</Label>
                <Input
                  id="response-delay"
                  type="number"
                  bind:value={aiSettings.behavior.response_delay}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Custom Responses -->
        <Card>
          <CardHeader>
            <CardTitle>Custom Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="space-y-2">
                {#each customResponses as response, index}
                  <div class="flex items-start gap-2 p-3 bg-gray-50 rounded-md">
                    <div class="flex-1">
                      <p class="font-medium text-sm">{response.trigger}</p>
                      <p class="text-sm text-gray-600">{response.response}</p>
                    </div>
                    <button
                      on:click={() => removeCustomResponse(index)}
                      class="text-red-500 hover:text-red-700"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                {/each}
              </div>

              <div class="border-t pt-4">
                <div class="space-y-2">
                  <Input
                    placeholder="Trigger phrase..."
                    bind:value={newCustomTrigger}
                  />
                  <textarea
                    placeholder="Response..."
                    bind:value={newCustomResponse}
                    rows="2"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  ></textarea>
                  <Button size="sm" on:click={addCustomResponse}>Add Response</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Blocked Topics -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Shield class="h-5 w-5" />
              Blocked Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="flex flex-wrap gap-2">
                {#each blockedTopics as topic}
                  <Badge variant="secondary" class="pr-1">
                    {topic}
                    <button
                      on:click={() => removeBlockedTopic(topic)}
                      class="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </Badge>
                {/each}
              </div>

              <div class="flex gap-2">
                <Input
                  placeholder="Add blocked topic..."
                  bind:value={newBlockedTopic}
                  on:keypress={(e) => e.key === 'Enter' && addBlockedTopic()}
                />
                <Button size="sm" on:click={addBlockedTopic}>Add</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button on:click={saveAISettings} disabled={saving} class="w-full">
          <Save class="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>

      <div class="space-y-6">
        <!-- Performance Metrics -->
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <div>
                <p class="text-sm text-gray-500">Avg Response Time</p>
                <p class="text-2xl font-bold">{aiSettings.performance.avg_response_time}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Accuracy Rate</p>
                <p class="text-2xl font-bold">{aiSettings.performance.accuracy_rate}%</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Satisfaction Score</p>
                <div class="flex items-center gap-1">
                  <p class="text-2xl font-bold">{aiSettings.performance.satisfaction_score}</p>
                  <span class="text-yellow-500">★</span>
                </div>
              </div>
              <div>
                <p class="text-sm text-gray-500">Total Conversations</p>
                <p class="text-2xl font-bold">{aiSettings.performance.total_conversations.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Test AI -->
        <Card>
          <CardHeader>
            <CardTitle>Test AI Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div>
                <Label for="test-query">Test Query</Label>
                <textarea
                  id="test-query"
                  bind:value={testQuery}
                  rows="3"
                  placeholder="Type a test question..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                ></textarea>
              </div>

              <Button
                on:click={testAI}
                disabled={testing || !testQuery}
                class="w-full"
              >
                {testing ? 'Testing...' : 'Test AI'}
              </Button>

              {#if testResponse}
                <div class="p-3 bg-gray-50 rounded-md">
                  <p class="text-sm font-medium mb-1">AI Response:</p>
                  <p class="text-sm text-gray-700">{testResponse}</p>
                </div>
              {/if}
            </div>
          </CardContent>
        </Card>

        <!-- Quick Tips -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <AlertCircle class="h-5 w-5" />
              Quick Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul class="space-y-2 text-sm text-gray-600">
              <li>• Lower temperature (0.3-0.5) for more consistent responses</li>
              <li>• Higher temperature (0.7-0.9) for more creative responses</li>
              <li>• Add custom responses for frequently asked questions</li>
              <li>• Block topics outside your legal expertise</li>
              <li>• Test changes before saving to production</li>
              <li>• Monitor performance metrics regularly</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  </main>
</div>