// Base URL for the backend API.
//
// - In local dev: leave VITE_API_URL unset (or empty) so requests stay relative
//   and Vite's `server.proxy` (see vite.config.ts) forwards them to the backend.
// - In production (Vercel): set VITE_API_URL to the public backend URL, e.g.
//   `https://my-api.onrender.com`. Vite has no proxy in the built output, so the
//   requests MUST be absolute or they resolve against the static host and 404.
//
// The trailing slash is stripped so callers can safely concatenate `/impact_event/...`.
const rawBaseUrl = import.meta.env.VITE_API_URL ?? '';

export const API_CONFIG = {
  baseUrl: rawBaseUrl.replace(/\/$/, ''),
} as const;
