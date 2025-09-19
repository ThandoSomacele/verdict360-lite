<script lang="ts">
  interface Props {
    onSubmit: (data: ContactFormData) => void;
    onClose: () => void;
    initialEnquiry?: string;
  }

  export interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    preferredContact: 'email' | 'phone';
    enquiryDetails: string;
    message?: string;
  }

  let { onSubmit, onClose, initialEnquiry = '' }: Props = $props();

  let formData = $state<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    preferredContact: 'email',
    enquiryDetails: initialEnquiry,
    message: '',
  });

  let isSubmitting = $state(false);
  let errors = $state<Record<string, string>>({});

  function validateForm() {
    errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^(\+?27|0)[0-9]{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid South African phone number';
    }

    if (!formData.enquiryDetails.trim()) {
      errors.enquiryDetails = 'Please describe your legal matter';
    }

    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    isSubmitting = true;

    try {
      await onSubmit(formData);
      // Reset form on success
      formData = {
        name: '',
        email: '',
        phone: '',
        preferredContact: 'email',
        enquiryDetails: '',
        message: '',
      };
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
  <div class="flex justify-between items-center mb-4">
    <h3 class="text-lg font-semibold text-gray-900">Request Consultation</h3>
    <button onclick={onClose} class="text-gray-400 hover:text-gray-500" aria-label="Close form">
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>

  <p class="text-sm text-gray-600 mb-4">
    Please provide your contact details and we'll have an attorney reach out to you shortly.
  </p>

  <form onsubmit={handleSubmit} class="space-y-4">
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700 mb-1"> Full Name * </label>
      <input
        type="text"
        id="name"
        bind:value={formData.name}
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Your full name"
      />
      {#if errors.name}
        <p class="text-red-500 text-xs mt-1">{errors.name}</p>
      {/if}
    </div>

    <div>
      <label for="email" class="block text-sm font-medium text-gray-700 mb-1"> Email Address * </label>
      <input
        type="email"
        id="email"
        bind:value={formData.email}
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Your email address"
      />
      {#if errors.email}
        <p class="text-red-500 text-xs mt-1">{errors.email}</p>
      {/if}
    </div>

    <div>
      <label for="phone" class="block text-sm font-medium text-gray-700 mb-1"> Phone Number * </label>
      <input
        type="tel"
        id="phone"
        bind:value={formData.phone}
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Your phone number"
      />
      {#if errors.phone}
        <p class="text-red-500 text-xs mt-1">{errors.phone}</p>
      {/if}
    </div>

    <div>
      <label for="enquiryDetails" class="block text-sm font-medium text-gray-700 mb-1"> Legal Matter Details * </label>
      <textarea
        id="enquiryDetails"
        bind:value={formData.enquiryDetails}
        rows="4"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Please describe your legal matter (e.g., accident details, what happened, when it occurred, injuries sustained, etc.)"
      ></textarea>
      {#if errors.enquiryDetails}
        <p class="text-red-500 text-xs mt-1">{errors.enquiryDetails}</p>
      {/if}
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2"> Preferred Contact Method * </label>
      <div class="flex space-x-4">
        <label class="flex items-center">
          <input type="radio" bind:group={formData.preferredContact} value="email" class="mr-2" />
          <span class="text-sm">Email</span>
        </label>
        <label class="flex items-center">
          <input type="radio" bind:group={formData.preferredContact} value="phone" class="mr-2" />
          <span class="text-sm">Phone</span>
        </label>
      </div>
    </div>

    <div>
      <label for="message" class="block text-sm font-medium text-gray-700 mb-1"> Additional Message (Optional) </label>
      <textarea
        id="message"
        bind:value={formData.message}
        rows="3"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Briefly describe your legal matter..."
      ></textarea>
    </div>

    <div class="flex space-x-3">
      <button
        type="submit"
        disabled={isSubmitting}
        class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {#if isSubmitting}
          <span class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Submitting...
          </span>
        {:else}
          Submit Request
        {/if}
      </button>
      <button
        type="button"
        onclick={onClose}
        class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        Cancel
      </button>
    </div>
  </form>

  <p class="text-xs text-gray-500 mt-4">
    By submitting this form, you agree to our privacy policy and terms of service.
  </p>
</div>
