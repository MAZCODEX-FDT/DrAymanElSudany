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
    // Real API in development: run `php artisan serve` in backend/ (port 8000), then `npm run dev`.
    proxy: Object.fromEntries(['/api', '/sitemap.xml', '/setup'].map((p) => [p, { target: 'http://localhost:8000', changeOrigin: false }])),
  },
  build: {
    chunkSizeWarningLimit: 700, // recharts loads only with the lazy /dashboard chunks
  },
});
