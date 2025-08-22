<script lang="ts">
  import '../app.css';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { page } from '$app/stores';
  
  // Don't show header/footer on admin pages
  let showLayout = $derived(!$page.url.pathname.startsWith('/admin'));
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