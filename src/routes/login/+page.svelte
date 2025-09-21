<script lang="ts">
  import { goto } from '$app/navigation';
  import Button from '$lib/components/ui/button.svelte';
  import Input from '$lib/components/ui/input.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import CardHeader from '$lib/components/ui/card-header.svelte';
  import CardTitle from '$lib/components/ui/card-title.svelte';
  import CardContent from '$lib/components/ui/card-content.svelte';
  
  let email = $state('');
  let password = $state('');
  let loading = $state(false);
  let error = $state('');
  
  async function handleLogin(e: Event) {
    e.preventDefault();
    loading = true;
    error = '';
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect based on user role
        if (data.user.role === 'admin') {
          goto('/admin');
        } else {
          goto('/dashboard');
        }
      } else {
        const data = await response.json();
        error = data.message || 'Invalid email or password';
      }
    } catch (err) {
      error = 'An error occurred. Please try again.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Login - Verdict 360</title>
  <meta name="description" content="Login to your Verdict 360 account to access your legal AI assistant dashboard." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-16">
  <div class="w-full max-w-md">
    <Card>
      <CardHeader>
        <CardTitle class="text-2xl text-center">Welcome Back</CardTitle>
        <p class="text-center text-gray-600 mt-2">Sign in to your Verdict 360 account</p>
      </CardHeader>
      <CardContent>
        <form onsubmit={handleLogin} class="space-y-4">
          {#if error}
            <div class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          {/if}
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <Input
              type="email"
              id="email"
              bind:value={email}
              placeholder="you@lawfirm.com"
              required
              class="w-full"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              type="password"
              id="password"
              bind:value={password}
              placeholder="Enter your password"
              required
              class="w-full"
            />
          </div>
          
          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span class="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="/forgot-password" class="text-sm text-blue-600 hover:text-blue-700">
              Forgot password?
            </a>
          </div>
          
          <Button 
            type="submit" 
            variant="default" 
            class="w-full"
            disabled={loading}
          >
            {#if loading}
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            {:else}
              Sign In
            {/if}
          </Button>
        </form>
        
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <div class="mt-6 grid grid-cols-2 gap-3">
            <button class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span class="ml-2">Google</span>
            </button>
            
            <button class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <svg class="w-5 h-5" viewBox="0 0 23 23">
                <path fill="#f25022" d="M1 1h10v10H1z"/>
                <path fill="#00a4ef" d="M12 1h10v10H12z"/>
                <path fill="#7fba00" d="M1 12h10v10H1z"/>
                <path fill="#ffb900" d="M12 12h10v10H12z"/>
              </svg>
              <span class="ml-2">Microsoft</span>
            </button>
          </div>
        </div>
        
        <p class="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/signup" class="font-medium text-blue-600 hover:text-blue-700">
            Sign up for free
          </a>
        </p>
      </CardContent>
    </Card>

    <!-- Demo Credentials Box -->
    <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <p class="text-sm text-gray-700 text-center">
        <strong class="text-blue-700">Demo Credentials:</strong><br />
        <span class="font-mono text-xs">
          Admin: admin@verdict360.com / admin123<br />
          Staff: user@demo.com / demo123
        </span>
      </p>
    </div>
  </div>
</div>