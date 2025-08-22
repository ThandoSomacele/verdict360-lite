import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    port: 3000
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    exclude: ['pg', 'redis', 'nodemailer']
  }
});