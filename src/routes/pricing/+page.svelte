<script lang="ts">
  import Button from '$lib/components/ui/button.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import CardHeader from '$lib/components/ui/card-header.svelte';
  import CardTitle from '$lib/components/ui/card-title.svelte';
  import CardContent from '$lib/components/ui/card-content.svelte';
  import Badge from '$lib/components/ui/badge.svelte';
  
  const plans = [
    {
      name: 'Starter',
      price: 'R2,999',
      period: 'per month',
      description: 'Perfect for solo practitioners and small firms',
      features: [
        'Up to 100 conversations/month',
        '1 AI assistant',
        'Basic customization',
        'Email support',
        'Standard response time',
        'Basic analytics'
      ],
      cta: 'Start Free Trial',
      href: '/signup',
      popular: false
    },
    {
      name: 'Professional',
      price: 'R7,999',
      period: 'per month',
      description: 'Ideal for growing law firms',
      features: [
        'Up to 500 conversations/month',
        '3 AI assistants',
        'Advanced customization',
        'Priority email & phone support',
        'Fast response time',
        'Advanced analytics',
        'Calendar integration',
        'Custom branding'
      ],
      cta: 'Start Free Trial',
      href: '/signup',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      description: 'For large firms with specific needs',
      features: [
        'Unlimited conversations',
        'Unlimited AI assistants',
        'Full customization',
        'Dedicated account manager',
        'Instant response time',
        'Custom analytics & reporting',
        'API access',
        'White-label solution',
        'On-premise deployment option',
        'Custom integrations'
      ],
      cta: 'Contact Sales',
      href: '/contact',
      popular: false
    }
  ];
</script>

<svelte:head>
  <title>Pricing - Verdict 360</title>
  <meta name="description" content="Choose the perfect plan for your law firm. Start with a 14-day free trial. No credit card required." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
  <div class="container mx-auto px-4 py-16 max-w-7xl">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        Simple, Transparent Pricing
      </h1>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        Choose the plan that fits your law firm's needs. All plans include a 14-day free trial.
      </p>
    </div>
    
    <!-- Pricing Cards -->
    <div class="grid md:grid-cols-3 gap-8 mb-16">
      {#each plans as plan}
        <Card class="relative {plan.popular ? 'ring-2 ring-blue-600 transform scale-105' : ''}">
          {#if plan.popular}
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge variant="default" class="px-3 py-1">Most Popular</Badge>
            </div>
          {/if}
          
          <CardHeader>
            <CardTitle class="text-2xl">{plan.name}</CardTitle>
            <div class="mt-4">
              <span class="text-4xl font-bold">{plan.price}</span>
              <span class="text-gray-600 ml-2">{plan.period}</span>
            </div>
            <p class="text-gray-600 mt-2">{plan.description}</p>
          </CardHeader>
          
          <CardContent>
            <ul class="space-y-3 mb-8">
              {#each plan.features as feature}
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-gray-700">{feature}</span>
                </li>
              {/each}
            </ul>
            
            <a href={plan.href} class="block">
              <Button 
                variant={plan.popular ? 'default' : 'outline'} 
                class="w-full"
              >
                {plan.cta}
              </Button>
            </a>
          </CardContent>
        </Card>
      {/each}
    </div>
    
    <!-- FAQ Section -->
    <div class="max-w-3xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
      
      <div class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Do I need a credit card to start the trial?</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-gray-600">
              No, you can start your 14-day free trial without providing any payment information. 
              We'll only ask for payment details when you're ready to continue after the trial.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Can I change plans later?</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-gray-600">
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the 
              start of your next billing cycle.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Is my data secure?</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-gray-600">
              Absolutely. We use enterprise-grade encryption and are fully POPIA compliant. 
              Your data is stored in secure South African data centers and never shared with third parties.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">What happens if I exceed my conversation limit?</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-gray-600">
              We'll notify you when you're approaching your limit. You can either upgrade your plan 
              or purchase additional conversations as needed. Your service won't be interrupted.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
    
    <!-- CTA Section -->
    <div class="text-center mt-16 bg-white rounded-xl shadow-lg p-8">
      <h2 class="text-2xl font-bold mb-4">Ready to Transform Your Law Practice?</h2>
      <p class="text-gray-600 mb-6">
        Join hundreds of South African law firms already using Verdict 360
      </p>
      <div class="flex justify-center space-x-4">
        <a href="/signup">
          <Button variant="default" size="lg">
            Start Your Free Trial
          </Button>
        </a>
        <a href="/demo">
          <Button variant="outline" size="lg">
            See Live Demo
          </Button>
        </a>
      </div>
    </div>
  </div>
</div>