import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/impact_event': process.env.API_URL ?? 'http://localhost:8000',
      '/asteroid':     process.env.API_URL ?? 'http://localhost:8000',
    },
  },
});