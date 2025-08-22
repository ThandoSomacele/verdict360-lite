<script lang="ts">
  interface Props {
    user?: string;
    theme?: 'light' | 'dark';
  }
  
  let { 
    user = 'Legal Assistant',
    theme = 'light'
  }: Props = $props();
</script>

<div class="flex items-center space-x-3">
  <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd" />
    </svg>
  </div>
  
  <div class="max-w-xs lg:max-w-md">
    <div class="px-4 py-3 rounded-lg"
         class:bg-gray-700={theme === 'dark'}
         class:text-gray-100={theme === 'dark'}
         class:bg-gray-100={theme === 'light'}
         class:text-gray-900={theme === 'light'}>
      <div class="flex items-center space-x-2">
        <span class="text-sm" 
              class:text-gray-300={theme === 'dark'}
              class:text-gray-600={theme === 'light'}>
          {user} is typing
        </span>
        <div class="typing-dots flex space-x-1 items-center h-4">
          <div class="typing-dot typing-dot-1 w-2 h-2 bg-blue-500 rounded-full"></div>
          <div class="typing-dot typing-dot-2 w-2 h-2 bg-blue-500 rounded-full"></div>
          <div class="typing-dot typing-dot-3 w-2 h-2 bg-blue-500 rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  @keyframes keyPress {
    0%, 80%, 100% {
      transform: translateY(0px) scale(1);
      opacity: 0.6;
    }
    15% {
      transform: translateY(3px) scale(1.2);
      opacity: 1;
    }
  }
  
  .typing-dot {
    animation: keyPress 2s infinite;
  }
  
  .typing-dot-2 {
    animation-delay: 0.3s;
  }
  
  .typing-dot-3 {
    animation-delay: 0.6s;
  }
</style>