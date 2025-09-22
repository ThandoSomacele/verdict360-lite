import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      runtime: 'nodejs20.x',
      regions: ['iad1'], // US East
      maxDuration: 30
    }),
    alias: {
      $server: 'src/lib/server',
      $components: 'src/lib/components',
      $lib: 'src/lib'
    }
  }
};

export default config;