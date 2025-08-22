<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  interface Props {
    disabled?: boolean;
    theme?: 'light' | 'dark';
    placeholder?: string;
  }
  
  let { 
    disabled = false,
    theme = 'light',
    placeholder = 'Type your message...'
  }: Props = $props();
  
  const dispatch = createEventDispatcher<{ send: string }>();
  
  let message = $state('');
  let textArea: HTMLTextAreaElement;
  
  function handleSubmit() {
    if (message.trim() && !disabled) {
      dispatch('send', message.trim());
      message = '';
      adjustHeight();
    }
  }
  
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }
  
  function adjustHeight() {
    if (textArea) {
      textArea.style.height = 'auto';
      textArea.style.height = Math.min(textArea.scrollHeight, 120) + 'px';
    }
  }
  
  $effect(() => {
    if (message) adjustHeight();
  });
</script>

<div class="p-4 border-t"
     class:border-gray-200={theme === 'light'}
     class:border-gray-700={theme === 'dark'}>
  <div class="flex space-x-2">
    <textarea
      bind:this={textArea}
      bind:value={message}
      onkeydown={handleKeyDown}
      oninput={adjustHeight}
      {placeholder}
      {disabled}
      rows="1"
      aria-label="Message input"
      class="flex-1 resize-none rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border"
      class:bg-white={theme === 'light'}
      class:text-gray-900={theme === 'light'}
      class:border-gray-300={theme === 'light'}
      class:bg-gray-800={theme === 'dark'}
      class:text-gray-100={theme === 'dark'}
      class:border-gray-600={theme === 'dark'}
      style="max-height: 120px; overflow-y: auto;"
    ></textarea>
    
    <button
      onclick={handleSubmit}
      {disabled}
      aria-label="Send message"
      class="px-4 py-2 rounded-lg text-white font-medium transition-colors"
      class:bg-blue-600={!disabled}
      class:hover:bg-blue-700={!disabled}
      class:bg-gray-400={disabled}
      class:cursor-not-allowed={disabled}
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    </button>
  </div>
</div>