/**
 * App config from environment. Never put secrets in this file.
 * Set these in .env (see .env.example). .env is gitignored.
 */
export const AUTH_API_BASE =
  import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8000';

export const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:3001';
