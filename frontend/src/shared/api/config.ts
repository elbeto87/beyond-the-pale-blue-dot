export const API_CONFIG = {
  // Always use relative URLs so that Vite's proxy can intercept them.
  // The proxy configuration in vite.config.ts will redirect /impact_event and /asteroid
  // to the backend API (http://api:8000 in Docker, or http://localhost:8000 in dev).
  baseUrl: '',
} as const;
