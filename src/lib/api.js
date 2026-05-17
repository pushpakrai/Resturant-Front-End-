const trim = (u) => (typeof u === 'string' ? u.replace(/\/$/, '') : '');

/** Vite dev: use proxy `/api`. Production: set VITE_API_URL to full API origin + `/api`. */
export const API = trim(import.meta.env.VITE_API_URL) || '/api';
