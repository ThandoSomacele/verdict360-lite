<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import ChatMessage from './ChatMessage.svelte';
  import MessageInput from './MessageInput.svelte';
  import TypingIndicator from './TypingIndicator.svelte';
  import ContactForm from './ContactForm.svelte';
  import type { ChatMessage as ChatMessageType } from '$lib/types';
  
  // Props using Svelte 5 $props()
  interface Props {
    tenantId?: string;
    position?: 'bottom-left' | 'bottom-right';
    theme?: 'light' | 'dark';
  }
  
  let {
    tenantId = '11111111-1111-1111-1111-111111111111', // Use actual UUID for demo tenant
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
  let isButtonAnimating = $state(false);
  let hasPlayedSound = $state(false);
  let typingStartTime = $state<number>(0);
  
  onMount(async () => {
    mounted = true;
    await initializeSocket();
    
    // Play notification sound after a delay to draw attention
    setTimeout(() => {
      playNotificationSound();
      // Also add a subtle animation to the chat button
      animateChatButton();
    }, 3000); // Wait 3 seconds after page load
  });
  
  onDestroy(() => {
    if (socket) {
      socket.disconnect();
    }
  });

  async function initializeSocket() {
    // Socket.io is optional - only initialize if available
    // This allows the chat to work on serverless platforms like Vercel
    if (typeof window !== 'undefined') {
      try {
        const { io } = await import('socket.io-client');
        socket = io('/', {
          transports: ['websocket', 'polling']
        });

        socket.on('connect', handleConnect);
        socket.on('ai-response', handleAIResponse);
        socket.on('typing', handleTyping);
        socket.on('contact-submitted', handleContactSubmitted);
        socket.on('disconnect', handleDisconnect);
      } catch (error) {
        console.log('Socket.io not available, using HTTP API fallback');
        // Chat will work via HTTP API instead
      }
    }
  }
  
  async function initializeChat() {
    if (!mounted) return;

    try {
      isLoading = true;

      // Get tenant info
      const tenantRes = await fetch('/api/tenants/current', {
        headers: { 'X-Tenant-Id': tenantId }
      });
      tenant = await tenantRes.json();

      // Join tenant-specific room if socket is available
      if (socket) {
        socket.emit('join-tenant', tenantId);
      }

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
        senderType: 'bot',
        sentAt: new Date().toISOString(),
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
    // Typing indicator was shown immediately when user sent message
    // Calculate dynamic typing delay based on message length for natural feel
    const wordCount = message.content.split(' ').length;
    // 1.5 seconds minimum + 50ms per word, max 4 seconds
    const minimumTypingDelay = Math.min(1500 + (wordCount * 50), 4000);

    const currentTime = Date.now();
    const elapsedTime = currentTime - typingStartTime;
    const remainingDelay = Math.max(0, minimumTypingDelay - elapsedTime);

    // Wait for the natural typing duration before showing response
    setTimeout(() => {
      // Stop typing indicator and add the complete message
      isTyping = false;
      typingUser = null;

      // Add the complete message instantly
      messages = [...messages, message];
      scrollToBottom();

      // Check if AI response should show contact form
      if (message.metadata?.isDataCollection ||
          message.metadata?.shouldOfferConsultation) {
        showContactForm = true;
      }
    }, remainingDelay);
  }

  // Removed typeMessage function as we're no longer using character-by-character animation
  
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
    if (!content.trim()) return;

    // Add user message immediately
    const userMessage: ChatMessageType = {
      id: `user_${Date.now()}`,
      content: content.trim(),
      sender: 'user',
      senderType: 'visitor',
      sentAt: new Date().toISOString(),
      tenantId
    };

    messages = [...messages, userMessage];
    scrollToBottom();

    // Show typing indicator after 3-second delay
    setTimeout(() => {
      isTyping = true;
      typingUser = 'Sarah';
      typingStartTime = Date.now(); // Track when typing started
      scrollToBottom();
    }, 3000);

    try {
      // Send message via HTTP API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Id': tenantId
        },
        body: JSON.stringify({
          message: content.trim(),
          conversationId: sessionStorage.getItem('conversationId') || undefined
        })
      });

      const data = await response.json();

      if (data.success && data.response) {
        // Store conversation ID for future messages
        if (data.conversationId) {
          sessionStorage.setItem('conversationId', data.conversationId);
        }

        // Create AI message
        const aiMessage: ChatMessageType = {
          id: `ai_${Date.now()}`,
          content: data.response,
          sender: 'ai',
          senderType: 'bot',
          sentAt: new Date().toISOString(),
          tenantId,
          metadata: data.metadata
        };

        // Handle the AI response with typing delay
        handleAIResponse(aiMessage);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Failed to send message:', error);

      // Stop typing indicator on error
      isTyping = false;
      typingUser = null;

      // Add error message
      const errorMessage: ChatMessageType = {
        id: `error_${Date.now()}`,
        content: 'I apologize, but I encountered an error. Please try again.',
        sender: 'ai',
        senderType: 'bot',
        sentAt: new Date().toISOString(),
        tenantId
      };

      messages = [...messages, errorMessage];
      scrollToBottom();
    }
  }

  async function submitContactForm(contactInfo: any) {
    try {
      // Use HTTP API for contact submission
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Id': tenantId
        },
        body: JSON.stringify({
          ...contactInfo,
          conversationId: sessionStorage.getItem('conversationId') || undefined
        })
      });

      const data = await response.json();

      if (data.success) {
        // Add a success message to the chat
        const confirmationMessage: ChatMessageType = {
          id: `confirmation_${Date.now()}`,
          content: 'Thank you for your information. An attorney will contact you shortly.',
          sender: 'ai',
          senderType: 'bot',
          sentAt: new Date().toISOString(),
          tenantId
        };

        messages = [...messages, confirmationMessage];
        showContactForm = false;
        scrollToBottom();
      } else {
        throw new Error(data.error || 'Failed to submit contact information');
      }
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      // Show error message
      const errorMessage: ChatMessageType = {
        id: `error_${Date.now()}`,
        content: 'There was an error submitting your information. Please try again.',
        sender: 'ai',
        senderType: 'bot',
        sentAt: new Date().toISOString(),
        tenantId
      };

      messages = [...messages, errorMessage];
      scrollToBottom();
    }
  }
  
  function toggleChat() {
    isOpen = !isOpen;
    if (isOpen && !tenant) {
      initializeChat();
    }
  }
  
  function playNotificationSound() {
    if (hasPlayedSound || isOpen) return; // Don't play if already played or chat is open
    
    try {
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800; // Frequency in Hz
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      
      hasPlayedSound = true;
    } catch (error) {
      console.log('Could not play notification sound:', error);
    }
  }
  
  function animateChatButton() {
    if (isOpen) return;
    isButtonAnimating = true;
    setTimeout(() => {
      isButtonAnimating = false;
    }, 2000);
  }

  function getConversationSummary(): string {
    // Extract key legal matter from conversation
    const userMessages = messages.filter(m => m.sender === 'user');

    // Keywords that indicate actual legal matters
    const legalKeywords = [
      'letter of demand', 'owes me money', 'accident', 'injury', 'divorce',
      'contract', 'dispute', 'legal advice', 'sue', 'court', 'eviction',
      'will', 'estate', 'custody', 'maintenance', 'debt', 'compensation',
      'attorney', 'lawyer', 'consultation', 'legal help', 'legal assistance'
    ];

    // Find messages containing legal matters
    const relevantMessages = userMessages.filter(msg => {
      const lower = msg.content.toLowerCase();
      return legalKeywords.some(keyword => lower.includes(keyword));
    });

    // If we found legal matter messages, use those; otherwise use last message
    const messagesToSummarize = relevantMessages.length > 0
      ? relevantMessages
      : userMessages.slice(-1);

    // Create a clean summary
    let summary = messagesToSummarize.map(m => m.content).join('. ');

    // Clean up the summary
    if (summary.length > 200) {
      summary = summary.substring(0, 200) + '...';
    }

    // Add context if it's about a letter of demand
    if (summary.toLowerCase().includes('letter of demand')) {
      summary = `Letter of Demand Request: ${summary}`;
    } else if (summary.toLowerCase().includes('accident')) {
      summary = `Accident Matter: ${summary}`;
    }

    return summary || 'General legal enquiry';
  }

  let positionClass = $derived(position === 'bottom-left' ? 'bottom-4 left-4' : 'bottom-4 right-4');
</script>

<div class="fixed {positionClass} z-50">
  <!-- Chat Button -->
  {#if !isOpen}
    <button
      onclick={toggleChat}
      class="w-16 h-16 rounded-full shadow-lg flex items-center justify-center
             transition-all duration-300 hover:scale-110 text-white hover:shadow-xl
             {isButtonAnimating ? 'attention-grabbing' : ''}"
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

      <!-- Disclaimer -->
      <div class="px-3 py-2 bg-gray-50 border-b border-gray-200">
        <p class="text-[10px] text-gray-600 text-center">
          AI-powered assistant. Not legal advice. Attorney review required.
        </p>
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
          <ContactForm
            onSubmit={submitContactForm}
            onClose={() => showContactForm = false}
            initialEnquiry={getConversationSummary()}
          />
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

<style>
  @keyframes attention-pulse {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    50% {
      transform: scale(1.1);
      box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4);
    }
  }
  
  :global(.attention-grabbing) {
    animation: attention-pulse 2s ease-in-out infinite;
  }
</style>
