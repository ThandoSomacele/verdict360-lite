import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { socketIoPlugin } from './vite-plugin-socket-io.js';

export default defineConfig({
  plugins: [sveltekit(), socketIoPlugin()],
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