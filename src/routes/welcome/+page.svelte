<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import Button from '$lib/components/ui/button.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import CardHeader from '$lib/components/ui/card-header.svelte';
  import CardTitle from '$lib/components/ui/card-title.svelte';
  import CardContent from '$lib/components/ui/card-content.svelte';

  let tenantSubdomain = '';

  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    tenantSubdomain = urlParams.get('tenant') || '';
  });

  const setupSteps = [
    {
      icon: '🏢',
      title: 'Complete Your Profile',
      description: 'Add your firm logo, contact details, and practice areas',
      action: '/admin/settings',
      buttonText: 'Setup Profile'
    },
    {
      icon: '🤖',
      title: 'Customize Your AI Assistant',
      description: 'Train your AI with your firm\'s expertise and set response guidelines',
      action: '/admin/ai-settings',
      buttonText: 'Configure AI'
    },
    {
      icon: '🔧',
      title: 'Install Chat Widget',
      description: 'Add the chat widget to your website with a simple code snippet',
      action: '/admin/installation',
      buttonText: 'Get Code'
    },
    {
      icon: '👥',
      title: 'Invite Your Team',
      description: 'Add team members and assign roles for collaborative lead management',
      action: '/admin/team',
      buttonText: 'Invite Team'
    }
  ];
</script>

<svelte:head>
  <title>Welcome to Verdict 360!</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
  <div class="container mx-auto px-4 py-16 max-w-6xl">
    <!-- Success Message -->
    <div class="text-center mb-12">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
        <svg class="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
      </div>

      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        🎉 Welcome to Verdict 360!
      </h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-2">
        Your account has been created successfully. Your 14-day free trial has started!
      </p>
      {#if tenantSubdomain}
        <p class="text-lg text-blue-600 font-semibold">
          Your platform URL: {tenantSubdomain}.verdict360.com
        </p>
      {/if}
    </div>

    <!-- Quick Start Guide -->
    <Card class="mb-8">
      <CardHeader>
        <CardTitle class="text-2xl">Quick Start Guide</CardTitle>
        <p class="text-gray-600">Complete these steps to get your AI legal assistant up and running</p>
      </CardHeader>
      <CardContent>
        <div class="grid md:grid-cols-2 gap-6">
          {#each setupSteps as step}
            <div class="flex space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div class="text-3xl">{step.icon}</div>
              <div class="flex-1">
                <h3 class="font-semibold mb-1">{step.title}</h3>
                <p class="text-sm text-gray-600 mb-3">{step.description}</p>
                <a href={step.action}>
                  <Button variant="outline" size="sm">
                    {step.buttonText}
                  </Button>
                </a>
              </div>
            </div>
          {/each}
        </div>
      </CardContent>
    </Card>

    <!-- Next Steps -->
    <div class="grid md:grid-cols-3 gap-6">
      <Card>
        <CardContent class="p-6">
          <div class="text-blue-600 mb-4">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 class="font-semibold mb-2">Documentation</h3>
          <p class="text-sm text-gray-600 mb-4">
            Learn how to make the most of Verdict 360
          </p>
          <a href="/docs" class="text-blue-600 text-sm font-medium hover:underline">
            Read the docs →
          </a>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="text-green-600 mb-4">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 class="font-semibold mb-2">Support</h3>
          <p class="text-sm text-gray-600 mb-4">
            Get help from our support team
          </p>
          <a href="mailto:support@verdict360.com" class="text-blue-600 text-sm font-medium hover:underline">
            Contact support →
          </a>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="text-purple-600 mb-4">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 class="font-semibold mb-2">Go Live</h3>
          <p class="text-sm text-gray-600 mb-4">
            Access your dashboard and start managing leads
          </p>
          <a href="/dashboard" class="text-blue-600 text-sm font-medium hover:underline">
            Go to dashboard →
          </a>
        </CardContent>
      </Card>
    </div>

    <!-- CTA -->
    <div class="text-center mt-12">
      <a href="/dashboard">
        <Button variant="default" size="lg">
          Go to Your Dashboard
        </Button>
      </a>
      <p class="text-sm text-gray-600 mt-4">
        Need help? Call us at <a href="tel:0861234567" class="text-blue-600">086 123 4567</a>
        or email <a href="mailto:support@verdict360.com" class="text-blue-600">support@verdict360.com</a>
      </p>
    </div>
  </div>
</div>