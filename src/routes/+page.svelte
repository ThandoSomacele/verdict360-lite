<script lang="ts">
  import { onMount } from 'svelte';
  
  let mounted = false;
  
  onMount(() => {
    mounted = true;
  });
</script>

<svelte:head>
  <title>Verdict 360 - AI Legal Assistant for South African Law Firms</title>
  <meta name="description" content="Multi-tenant SaaS platform providing AI-powered legal chatbots for South African law firms. Streamline client consultations and legal advice." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 w-full overflow-x-hidden">
  <div class="container mx-auto px-4 py-16 max-w-7xl">
    <div class="text-center mb-16">
      <h1 class="text-5xl font-bold text-gray-900 mb-6">
        Welcome to <span class="text-blue-600">Verdict 360</span>
      </h1>
      <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
        The premier AI-powered legal assistant platform for South African law firms. 
        Enhance client consultations with intelligent, context-aware legal guidance.
      </p>
      
      <div class="flex justify-center space-x-4">
        <a 
          href="/demo" 
          class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Try Demo
        </a>
        <a 
          href="/admin" 
          class="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
        >
          Admin Dashboard
        </a>
      </div>
    </div>

    <div class="grid md:grid-cols-3 gap-8 mb-16">
      <div class="bg-white p-8 rounded-xl shadow-lg">
        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-4">AI-Powered Consultations</h3>
        <p class="text-gray-600">
          Intelligent chatbot trained on South African law provides instant, accurate legal guidance to your clients.
        </p>
      </div>

      <div class="bg-white p-8 rounded-xl shadow-lg">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-4">Multi-Tenant SaaS</h3>
        <p class="text-gray-600">
          Each law firm gets their own branded instance with isolated data and custom configurations.
        </p>
      </div>

      <div class="bg-white p-8 rounded-xl shadow-lg">
        <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
          <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-4">Calendar Integration</h3>
        <p class="text-gray-600">
          Seamless appointment booking with Google Calendar integration and automated client notifications.
        </p>
      </div>
    </div>

    {#if mounted}
      <div class="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-8">Live Demo</h2>
        <div class="bg-gray-50 rounded-lg p-4 h-96 flex items-center justify-center relative">
          <p class="text-gray-500">Try the chat widget in the bottom-right corner!</p>
        </div>
      </div>
      
      <!-- Import the ChatWidget component -->
      {#await import('$components/ChatWidget.svelte')}
        <div class="fixed bottom-4 right-4 w-16 h-16 bg-blue-600 rounded-full animate-pulse"></div>
      {:then { default: ChatWidget }}
        <ChatWidget tenantId="demo" />
      {/await}
    {/if}
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background: white;
  }
</style>