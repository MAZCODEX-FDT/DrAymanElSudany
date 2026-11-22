import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  // '/' on Bluehost; '/DrAymanElSudany/' for the GitHub Pages demo (set BASE_PATH).
  base: process.env.BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: {
    // Point this at a local PHP server (php -S localhost:8000 -t public) to use the real API.
    proxy: { '/api': { target: 'http://localhost:8000', changeOrigin: false } },
  },
  build: {
    chunkSizeWarningLimit: 700, // recharts loads only with the lazy /dashboard chunks
  },
});
