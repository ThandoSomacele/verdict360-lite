<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import ChatMessage from './ChatMessage.svelte';
  import MessageInput from './MessageInput.svelte';
  import TypingIndicator from './TypingIndicator.svelte';
  import type { ChatMessage as ChatMessageType } from '$lib/types';
  
  // Props using Svelte 5 $props()
  interface Props {
    tenantId?: string;
    position?: 'bottom-left' | 'bottom-right';
    theme?: 'light' | 'dark';
  }
  
  let { 
    tenantId = 'demo',
    position = 'bottom-right',
    theme = 'light'
  }: Props = $props();
  
  // Reactive state using Svelte 5 $state
  let isOpen = $state(false);
  let isLoading = $state(false);
  let isTyping = $state(false);
  let typingUser = $state<string | null>(null);
  let tenant = $state<any>(null);
  let showContactForm = $state(false);
  
  // Messages array with Svelte 5 state
  let messages = $state<ChatMessageType[]>([]);
  
  let socket = $state<any>();
  let mounted = $state(false);
  let messagesContainer = $state<HTMLElement>();
  
  onMount(async () => {
    mounted = true;
    await initializeSocket();
  });
  
  onDestroy(() => {
    if (socket) {
      socket.disconnect();
    }
  });

  async function initializeSocket() {
    if (typeof window !== 'undefined') {
      const { io } = await import('socket.io-client');
      socket = io('/', {
        transports: ['websocket', 'polling']
      });
      
      socket.on('connect', handleConnect);
      socket.on('ai-response', handleAIResponse);
      socket.on('typing', handleTyping);
      socket.on('contact-submitted', handleContactSubmitted);
      socket.on('disconnect', handleDisconnect);
    }
  }
  
  async function initializeChat() {
    if (!mounted || !socket) return;
    
    try {
      isLoading = true;
      
      // Get tenant info
      const tenantRes = await fetch('/api/tenants/current', {
        headers: { 'X-Tenant-Id': tenantId }
      });
      tenant = await tenantRes.json();
      
      // Join tenant-specific room
      socket.emit('join-tenant', tenantId);
      
      // Get welcome message
      const welcomeRes = await fetch('/api/ai/welcome', {
        headers: { 'X-Tenant-Id': tenantId }
      });
      const welcome = await welcomeRes.json();
      
      // Add welcome message
      const welcomeMessage: ChatMessageType = {
        id: `welcome_${Date.now()}`,
        content: welcome.response,
        sender: 'ai',
        timestamp: new Date(),
        tenantId,
        metadata: welcome.metadata
      };
      
      messages = [...messages, welcomeMessage];
      scrollToBottom();
      
    } catch (error) {
      console.error('Chat initialization failed:', error);
    } finally {
      isLoading = false;
    }
  }
  
  function handleConnect() {
    console.log('Socket connected');
  }

  function handleDisconnect() {
    console.log('Socket disconnected');
  }
  
  function handleAIResponse(message: ChatMessageType) {
    messages = [...messages, message];
    isTyping = false;
    typingUser = null;
    
    // Check if AI response should show contact form
    if (message.metadata?.isDataCollection) {
      showContactForm = true;
    }
    
    scrollToBottom();
  }
  
  function handleTyping(data: { isTyping: boolean; sender: string }) {
    if (data.sender === 'ai') {
      isTyping = data.isTyping;
      typingUser = data.isTyping ? 'Legal Assistant' : null;
    }
  }

  function handleContactSubmitted(data: { success: boolean; message: string }) {
    if (data.success) {
      showContactForm = false;
    }
    // You could show a toast notification here
    console.log(data.message);
  }

  function scrollToBottom() {
    setTimeout(() => {
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 100);
  }
  
  async function sendMessage(content: string) {
    if (!socket || !content.trim()) return;
    
    // Add user message immediately
    const userMessage: ChatMessageType = {
      id: `user_${Date.now()}`,
      content: content.trim(),
      sender: 'user',
      timestamp: new Date(),
      tenantId
    };
    
    messages = [...messages, userMessage];
    scrollToBottom();
    
    // Send typing indicator
    socket.emit('typing', { isTyping: true, tenantId });
    
    // Get conversation history
    let conversationHistory: ChatMessageType[] = messages.slice(-10); // Keep last 10 messages
    
    // Send message via socket
    socket.emit('chat-message', {
      message: content.trim(),
      conversationHistory,
      tenantId
    });
    
    // Stop typing indicator
    setTimeout(() => {
      socket.emit('typing', { isTyping: false, tenantId });
    }, 1000);
  }

  function submitContactForm(contactInfo: any) {
    if (!socket) return;
    
    socket.emit('submit-contact', {
      contactInfo,
      tenantId
    });
  }
  
  function toggleChat() {
    isOpen = !isOpen;
    if (isOpen && !tenant) {
      initializeChat();
    }
  }
  
  let positionClass = $derived(position === 'bottom-left' ? 'bottom-4 left-4' : 'bottom-4 right-4');
</script>

<div class="fixed {positionClass} z-50">
  <!-- Chat Button -->
  {#if !isOpen}
    <button
      onclick={toggleChat}
      class="w-16 h-16 rounded-full shadow-lg flex items-center justify-center
             transition-all duration-300 hover:scale-110 text-white hover:shadow-xl"
      class:bg-blue-600={!tenant?.branding?.primaryColor}
      style={tenant?.branding?.primaryColor ? `background-color: ${tenant.branding.primaryColor}` : ''}
      aria-label="Open chat"
    >
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} 
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <div class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
    </button>
  {/if}

  <!-- Chat Window -->
  {#if isOpen}
    <div class="w-96 h-[32rem] bg-white rounded-lg shadow-2xl border flex flex-col overflow-hidden"
         class:bg-gray-800={theme === 'dark'}
         class:border-gray-700={theme === 'dark'}
         class:border-gray-200={theme === 'light'}>
      
      <!-- Header -->
      <div class="px-4 py-3 border-b flex items-center justify-between"
           class:bg-blue-600={!tenant?.branding?.primaryColor}
           class:text-white={true}
           style={tenant?.branding?.primaryColor ? `background-color: ${tenant.branding.primaryColor}` : ''}>
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-green-400 rounded-full"></div>
          <span class="font-medium text-sm">
            {tenant?.branding?.companyName || 'Legal Assistant'}
          </span>
        </div>
        <button onclick={() => isOpen = false} class="hover:bg-black hover:bg-opacity-20 p-1 rounded" aria-label="Close chat">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Messages -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4" bind:this={messagesContainer}>
        {#if isLoading}
          <div class="flex justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        {/if}

        {#each messages as message (message.id)}
          <ChatMessage {message} {tenant} {theme} />
        {/each}

        <!-- Contact Form -->
        {#if showContactForm}
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-xs ml-auto mr-2">
            <h4 class="font-medium text-gray-900 mb-3">Contact Information</h4>
            <form onsubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const contactInfo = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                company: formData.get('company') || '',
                message: formData.get('message') || ''
              };
              submitContactForm(contactInfo);
            }}>
              <div class="space-y-3">
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name *"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address *"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone Number *"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  name="company"
                  type="text"
                  placeholder="Company (optional)"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div class="flex space-x-2 pt-2">
                  <button
                    type="submit"
                    class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onclick={() => showContactForm = false}
                    class="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        {/if}

        {#if isTyping && typingUser}
          <TypingIndicator user={typingUser} {theme} />
        {/if}
      </div>

      <!-- Input -->
      <MessageInput 
        on:send={e => sendMessage(e.detail)} 
        disabled={isLoading}
        {theme}
        placeholder="Type your legal enquiry..."
      />
    </div>
  {/if}
</div>