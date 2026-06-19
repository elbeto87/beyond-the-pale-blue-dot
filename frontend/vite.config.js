var _a, _b;
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    plugins: [react()],
    server: {
        host: '0.0.0.0',
        port: 5173,
        proxy: {
            '/impact_event': (_a = process.env.API_URL) !== null && _a !== void 0 ? _a : 'http://localhost:8000',
            '/asteroid': (_b = process.env.API_URL) !== null && _b !== void 0 ? _b : 'http://localhost:8000',
        },
    },
});
