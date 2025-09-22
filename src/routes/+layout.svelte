<script lang="ts">
  import '../app.css';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { initializeSeedData } from '$lib/utils/seedData';

  // Don't show header/footer on admin pages
  let showLayout = $derived(!$page.url.pathname.startsWith('/admin'));

  onMount(() => {
    // Initialize seed data on first load
    initializeSeedData();
  });
</script>

{#if showLayout}
  <Header />
{/if}

<main class="flex-1">
  <slot />
</main>

{#if showLayout}
  <Footer />
{/if}