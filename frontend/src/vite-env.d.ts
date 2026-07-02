/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public base URL of the backend API (e.g. https://my-api.onrender.com). */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
