<script lang="ts">
  import { goto } from '$app/navigation';
  import Button from '$lib/components/ui/button.svelte';
  import Input from '$lib/components/ui/input.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import CardHeader from '$lib/components/ui/card-header.svelte';
  import CardTitle from '$lib/components/ui/card-title.svelte';
  import CardContent from '$lib/components/ui/card-content.svelte';
  
  let firmName = $state('');
  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let phone = $state('');
  let loading = $state(false);
  let error = $state('');
  
  async function handleSignup(e: Event) {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      error = 'Passwords do not match';
      return;
    }
    
    loading = true;
    error = '';
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firmName, email, password, phone })
      });
      
      if (response.ok) {
        goto('/login?registered=true');
      } else {
        const data = await response.json();
        error = data.message || 'Registration failed';
      }
    } catch (err) {
      error = 'An error occurred. Please try again.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Sign Up - Verdict 360</title>
  <meta name="description" content="Create your Verdict 360 account and start transforming your law firm with AI-powered legal assistance." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-16">
  <div class="w-full max-w-md">
    <Card>
      <CardHeader>
        <CardTitle class="text-2xl text-center">Create Your Account</CardTitle>
        <p class="text-center text-gray-600 mt-2">Start your 14-day free trial</p>
      </CardHeader>
      <CardContent>
        <form onsubmit={handleSignup} class="space-y-4">
          {#if error}
            <div class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          {/if}
          
          <div>
            <label for="firmName" class="block text-sm font-medium text-gray-700 mb-1">
              Law Firm Name
            </label>
            <Input
              type="text"
              id="firmName"
              bind:value={firmName}
              placeholder="Smith & Associates"
              required
              class="w-full"
            />
          </div>
          
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
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <Input
              type="tel"
              id="phone"
              bind:value={phone}
              placeholder="+27 11 234 5678"
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
              placeholder="Create a strong password"
              required
              class="w-full"
            />
            <p class="text-xs text-gray-500 mt-1">At least 8 characters with numbers and symbols</p>
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <Input
              type="password"
              id="confirmPassword"
              bind:value={confirmPassword}
              placeholder="Confirm your password"
              required
              class="w-full"
            />
          </div>
          
          <div class="flex items-start">
            <input 
              type="checkbox" 
              required 
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
            />
            <label class="ml-2 text-sm text-gray-600">
              I agree to the <a href="/terms" class="text-blue-600 hover:text-blue-700">Terms of Service</a> and 
              <a href="/privacy" class="text-blue-600 hover:text-blue-700">Privacy Policy</a>
            </label>
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
              Creating account...
            {:else}
              Start Free Trial
            {/if}
          </Button>
        </form>
        
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" class="font-medium text-blue-600 hover:text-blue-700">
              Sign in
            </a>
          </p>
        </div>
        
        <!-- Benefits -->
        <div class="mt-6 pt-6 border-t">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">What's included:</h3>
          <ul class="space-y-2 text-sm text-gray-600">
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              14-day free trial, no credit card required
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              Full access to AI legal assistant
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              Dedicated support & onboarding
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  </div>
</div>