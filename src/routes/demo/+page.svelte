<script lang="ts">
  import ChatWidget from '$lib/components/ChatWidget.svelte';
  import { onMount } from 'svelte';
  
  let mounted = $state(false);
  
  onMount(() => {
    mounted = true;
  });
</script>

<svelte:head>
  <title>Demo - Verdict 360 Legal AI Assistant</title>
  <meta name="description" content="Try our AI-powered legal assistant demo. Experience how Verdict 360 can help streamline legal consultations for South African law firms." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
  <div class="container mx-auto px-4 py-16 max-w-7xl">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        Experience Verdict 360 AI Legal Assistant
      </h1>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        Chat with our AI legal assistant to see how it can help your law firm provide instant, 
        accurate legal guidance to clients 24/7.
      </p>
    </div>
    
    <div class="grid md:grid-cols-2 gap-8 mb-12">
      <!-- Demo Instructions -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <h2 class="text-2xl font-bold mb-4 text-gray-900">How to Use the Demo</h2>
        <ol class="space-y-3 text-gray-700">
          <li class="flex items-start">
            <span class="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mr-3 text-sm">1</span>
            <span>Click the chat widget in the bottom right corner to start</span>
          </li>
          <li class="flex items-start">
            <span class="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mr-3 text-sm">2</span>
            <span>Ask any South African legal question</span>
          </li>
          <li class="flex items-start">
            <span class="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mr-3 text-sm">3</span>
            <span>Get instant, context-aware legal guidance</span>
          </li>
          <li class="flex items-start">
            <span class="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mr-3 text-sm">4</span>
            <span>Schedule a consultation if needed</span>
          </li>
        </ol>
        
        <div class="mt-6 p-4 bg-blue-50 rounded-lg">
          <p class="text-sm text-blue-800">
            <strong>Note:</strong> This is a demo version. In production, the AI is customized 
            for each law firm with specific practice areas and knowledge bases.
          </p>
        </div>
      </div>
      
      <!-- Sample Questions -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <h2 class="text-2xl font-bold mb-4 text-gray-900">Sample Questions to Try</h2>
        <ul class="space-y-3">
          <li class="flex items-start">
            <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span class="text-gray-700">"What are the requirements for a valid will in South Africa?"</span>
          </li>
          <li class="flex items-start">
            <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span class="text-gray-700">"How does divorce work under South African law?"</span>
          </li>
          <li class="flex items-start">
            <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span class="text-gray-700">"What are my rights as a tenant in South Africa?"</span>
          </li>
          <li class="flex items-start">
            <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span class="text-gray-700">"How do I register a company in South Africa?"</span>
          </li>
          <li class="flex items-start">
            <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span class="text-gray-700">"What is POPIA and how does it affect my business?"</span>
          </li>
        </ul>
      </div>
    </div>
    
    <!-- Features Showcase -->
    <div class="bg-white rounded-xl shadow-lg p-8 mb-12">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-900">What Makes Our AI Special</h2>
      <div class="grid md:grid-cols-3 gap-6">
        <div class="text-center">
          <div class="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 class="font-semibold mb-2">SA Law Trained</h3>
          <p class="text-gray-600 text-sm">Specifically trained on South African legislation, case law, and legal procedures</p>
        </div>
        
        <div class="text-center">
          <div class="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 class="font-semibold mb-2">Instant Responses</h3>
          <p class="text-gray-600 text-sm">Provide immediate legal guidance to clients 24/7, reducing wait times</p>
        </div>
        
        <div class="text-center">
          <div class="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 class="font-semibold mb-2">Secure & Compliant</h3>
          <p class="text-gray-600 text-sm">POPIA compliant with enterprise-grade security for sensitive legal data</p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Chat Widget -->
{#if mounted}
  <ChatWidget tenantId="demo" position="bottom-right" theme="light" />
{/if}