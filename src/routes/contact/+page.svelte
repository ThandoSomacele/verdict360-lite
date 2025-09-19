<script lang="ts">
  import Button from '$lib/components/ui/button.svelte';
  import CardContent from '$lib/components/ui/card-content.svelte';
  import CardHeader from '$lib/components/ui/card-header.svelte';
  import CardTitle from '$lib/components/ui/card-title.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import Input from '$lib/components/ui/input.svelte';

  let formData = $state({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
  });

  let loading = $state(false);
  let success = $state(false);
  let error = $state('');

  async function handleSubmit(e: Event) {
    e.preventDefault();
    loading = true;
    error = '';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        success = true;
        formData = {
          name: '',
          email: '',
          company: '',
          phone: '',
          subject: '',
          message: '',
        };
      } else {
        error = 'Failed to send message. Please try again.';
      }
    } catch (err) {
      error = 'An error occurred. Please try again later.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Contact Us - Verdict 360</title>
  <meta
    name="description"
    content="Get in touch with Verdict 360. We're here to help transform your law practice with AI technology."
  />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
  <div class="container mx-auto px-4 py-16 max-w-7xl">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        Have questions about Verdict 360? We're here to help you transform your law practice with AI.
      </p>
    </div>

    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Contact Information -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Office Card -->
        <Card>
          <CardHeader>
            <CardTitle>Head Office</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="flex items-start">
                <svg
                  class="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div>
                  <p class="font-semibold">Address</p>
                  <p class="text-gray-600">123 Legal Street<br />Sandton, Johannesburg<br />South Africa, 2196</p>
                </div>
              </div>

              <div class="flex items-start">
                <svg
                  class="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <div>
                  <p class="font-semibold">Phone</p>
                  <p class="text-gray-600">+27 11 234 5678</p>
                  <p class="text-gray-600">+27 87 550 1234</p>
                </div>
              </div>

              <div class="flex items-start">
                <svg
                  class="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p class="font-semibold">Email</p>
                  <p class="text-gray-600">info@verdict360.com</p>
                  <p class="text-gray-600">support@verdict360.com</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Business Hours -->
        <Card>
          <CardHeader>
            <CardTitle>Business Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Monday - Friday</span>
                <span class="font-semibold">8:00 AM - 6:00 PM</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Saturday</span>
                <span class="font-semibold">9:00 AM - 1:00 PM</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Sunday</span>
                <span class="font-semibold">Closed</span>
              </div>
            </div>
            <p class="text-sm text-gray-500 mt-4">* AI Assistant available 24/7 for existing clients</p>
          </CardContent>
        </Card>

        <!-- Quick Links -->
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-2">
              <a href="/demo" class="flex items-center text-blue-600 hover:text-blue-700">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M9 5l7 7-7 7" />
                </svg>
                Try Live Demo
              </a>
              <a href="/pricing" class="flex items-center text-blue-600 hover:text-blue-700">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M9 5l7 7-7 7" />
                </svg>
                View Pricing
              </a>
              <a href="/about" class="flex items-center text-blue-600 hover:text-blue-700">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M9 5l7 7-7 7" />
                </svg>
                About Us
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Contact Form -->
      <div class="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Send Us a Message</CardTitle>
            <p class="text-gray-600">Fill out the form below and we'll get back to you within 24 hours.</p>
          </CardHeader>
          <CardContent>
            {#if success}
              <div class="bg-green-50 text-green-600 p-4 rounded-lg mb-6">
                <p class="font-semibold">Thank you for your message!</p>
                <p>We'll get back to you as soon as possible.</p>
              </div>
            {/if}

            {#if error}
              <div class="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                {error}
              </div>
            {/if}

            <form onsubmit={handleSubmit} class="space-y-6">
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700 mb-1"> Full Name * </label>
                  <Input
                    type="text"
                    id="name"
                    bind:value={formData.name}
                    required
                    class="w-full"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-1"> Email Address * </label>
                  <Input
                    type="email"
                    id="email"
                    bind:value={formData.email}
                    required
                    class="w-full"
                    placeholder="john@lawfirm.com"
                  />
                </div>
              </div>

              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label for="company" class="block text-sm font-medium text-gray-700 mb-1"> Law Firm / Company </label>
                  <Input
                    type="text"
                    id="company"
                    bind:value={formData.company}
                    class="w-full"
                    placeholder="Smith & Associates"
                  />
                </div>

                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700 mb-1"> Phone Number </label>
                  <Input
                    type="tel"
                    id="phone"
                    bind:value={formData.phone}
                    class="w-full"
                    placeholder="+27 11 234 5678"
                  />
                </div>
              </div>

              <div>
                <label for="subject" class="block text-sm font-medium text-gray-700 mb-1"> Subject * </label>
                <select
                  id="subject"
                  bind:value={formData.subject}
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a subject</option>
                  <option value="demo">Request a Demo</option>
                  <option value="pricing">Pricing Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label for="message" class="block text-sm font-medium text-gray-700 mb-1"> Message * </label>
                <textarea
                  id="message"
                  bind:value={formData.message}
                  required
                  rows="6"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <Button type="submit" variant="default" class="w-full md:w-auto" disabled={loading}>
                {#if loading}
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                {:else}
                  Send Message
                {/if}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</div>
