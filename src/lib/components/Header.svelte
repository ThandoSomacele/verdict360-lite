<script lang="ts">
  import { page } from '$app/state';

  let mobileMenuOpen = $state(false);

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }
</script>

<header class="bg-white shadow-sm border-b sticky top-0 z-40">
  <nav class="container mx-auto px-4 max-w-7xl">
    <div class="flex justify-between items-center h-16">
      <!-- Logo -->
      <a href="/" class="flex items-center space-x-2">
        <span class="text-2xl font-bold text-blue-600">Verdict 360</span>
      </a>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center space-x-8">
        <a href="/" class="text-gray-700 hover:text-blue-600 transition-colors" class:text-blue-600={page.url.pathname === '/'}>
          Home
        </a>
        <a href="/demo" class="text-gray-700 hover:text-blue-600 transition-colors" class:text-blue-600={page.url.pathname === '/demo'}>
          Demo
        </a>
        <a href="/pricing" class="text-gray-700 hover:text-blue-600 transition-colors" class:text-blue-600={page.url.pathname === '/pricing'}>
          Pricing
        </a>
        <a href="/about" class="text-gray-700 hover:text-blue-600 transition-colors" class:text-blue-600={page.url.pathname === '/about'}>
          About
        </a>
        <a href="/contact" class="text-gray-700 hover:text-blue-600 transition-colors" class:text-blue-600={page.url.pathname === '/contact'}>
          Contact
        </a>
      </div>
      
      <!-- Auth Buttons -->
      <div class="hidden md:flex items-center space-x-4">
        <a href="/login" class="text-gray-700 hover:text-blue-600 transition-colors">
          Login
        </a>
        <a href="/signup" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Get Started
        </a>
      </div>
      
      <!-- Mobile Menu Button -->
      <button
        onclick={toggleMobileMenu}
        class="md:hidden p-2 rounded-lg hover:bg-gray-100"
        aria-label="Toggle mobile menu"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {#if mobileMenuOpen}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M6 18L18 6M6 6l12 12" />
          {:else}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M4 6h16M4 12h16M4 18h16" />
          {/if}
        </svg>
      </button>
    </div>
    
    <!-- Mobile Navigation -->
    {#if mobileMenuOpen}
      <div class="md:hidden py-4 border-t">
        <div class="flex flex-col space-y-4">
          <a href="/" class="text-gray-700 hover:text-blue-600 transition-colors" onclick={() => mobileMenuOpen = false}>
            Home
          </a>
          <a href="/demo" class="text-gray-700 hover:text-blue-600 transition-colors" onclick={() => mobileMenuOpen = false}>
            Demo
          </a>
          <a href="/pricing" class="text-gray-700 hover:text-blue-600 transition-colors" onclick={() => mobileMenuOpen = false}>
            Pricing
          </a>
          <a href="/about" class="text-gray-700 hover:text-blue-600 transition-colors" onclick={() => mobileMenuOpen = false}>
            About
          </a>
          <a href="/contact" class="text-gray-700 hover:text-blue-600 transition-colors" onclick={() => mobileMenuOpen = false}>
            Contact
          </a>
          <hr class="border-gray-200" />
          <a href="/login" class="text-gray-700 hover:text-blue-600 transition-colors" onclick={() => mobileMenuOpen = false}>
            Login
          </a>
          <a href="/signup" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center" onclick={() => mobileMenuOpen = false}>
            Get Started
          </a>
        </div>
      </div>
    {/if}
  </nav>
</header>