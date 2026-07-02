import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Target for the dev-server proxy only (not exposed to the client bundle).
// In production the client talks to the backend directly via VITE_API_URL.
const PROXY_TARGET = process.env.API_PROXY_TARGET ?? 'http://localhost:8000';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/impact_event': PROXY_TARGET,
      '/asteroid': PROXY_TARGET,
    },
  },
});