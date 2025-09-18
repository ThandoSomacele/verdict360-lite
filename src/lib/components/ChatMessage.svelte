<script lang="ts">
  interface Props {
    message: any;
    tenant: any;
    theme?: 'light' | 'dark';
  }
  
  let { message, tenant, theme = 'light' }: Props = $props();
  
  const isBot = message.senderType === 'bot';
  const isVisitor = message.senderType === 'visitor';
  
  function formatTime(timestamp: string) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
</script>

{#if isVisitor}
  <div class="flex justify-end">
    <div class="max-w-xs lg:max-w-md">
      <div class="px-4 py-2 rounded-lg text-white"
           class:bg-blue-600={!tenant?.branding?.primaryColor}
           style={tenant?.branding?.primaryColor ? `background-color: ${tenant.branding.primaryColor}` : ''}>
        <p class="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>
      <div class="flex justify-end items-center mt-1 space-x-2">
        <span class="text-xs"
              class:text-gray-400={theme === 'dark'}
              class:text-gray-500={theme === 'light'}>
          {formatTime(message.sentAt)}
        </span>
        <div class="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="flex">
    <div class="flex-shrink-0 mr-3">
      <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
           class:bg-blue-600={!tenant?.branding?.primaryColor}
           style={tenant?.branding?.primaryColor ? `background-color: ${tenant.branding.primaryColor}` : ''}>
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
    
    <div class="max-w-xs lg:max-w-md">
      <div class="flex items-center mb-1">
        <span class="text-sm font-medium"
              class:text-gray-300={theme === 'dark'}
              class:text-gray-700={theme === 'light'}>
          {tenant?.branding?.companyName || 'Legal Assistant'}
        </span>
      </div>
      
      <div class="px-4 py-2 rounded-lg"
           class:bg-gray-700={theme === 'dark'}
           class:text-gray-100={theme === 'dark'}
           class:bg-gray-100={theme === 'light'}
           class:text-gray-900={theme === 'light'}>
        <p class="text-sm whitespace-pre-wrap">{message.content}</p>

        <!-- Contact form is handled by the main ContactForm component in ChatWidget -->
      </div>
      
      <div class="flex items-center mt-1">
        <span class="text-xs"
              class:text-gray-400={theme === 'dark'}
              class:text-gray-500={theme === 'light'}>
          {formatTime(message.sentAt)}
        </span>
      </div>
    </div>
  </div>
{/if}