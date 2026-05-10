/** API root including trailing slash and `/api/v1/`. */
function resolveApiBaseUrl() {
  // Vite dev server: same-origin + proxy in `vite.config.js`.
  if (import.meta.env.DEV) {
    return "/api/v1/";
  }
  const raw = import.meta.env.VITE_API_BASE_URL;
  if (typeof raw === "string" && raw.trim()) {
    const t = raw.trim();
    return t.endsWith("/") ? t : `${t}/`;
  }
  // Production: same-origin only. Never fall back to loopback — HTTPS public pages
  // cannot call 127.0.0.1 (browser blocks "public → private address space").
  // Use Netlify `netlify.toml` proxy to Django, or set VITE_API_BASE_URL to your API.
  return "/api/v1/";
}

export const API_BASE_URL = resolveApiBaseUrl();

/**
 * Host for legacy helpers. In dev, Django runs on 8080/8000 behind the Vite proxy.
 * In production without VITE_API_BASE_URL, the API is same-origin (e.g. Netlify → proxy).
 */
function resolveServerHost() {
  if (import.meta.env.DEV) {
    return "127.0.0.1:8000";
  }
  const raw = import.meta.env.VITE_API_BASE_URL?.trim();
  if (raw) {
    try {
      return new URL(raw.endsWith("/") ? raw : `${raw}/`).host;
    } catch {
      return "127.0.0.1:8000";
    }
  }
  if (typeof window !== "undefined" && window.location?.host) {
    return window.location.host;
  }
  return "";
}

export const SERVER_URL = resolveServerHost();

export const PAYPAL_CLIENT_ID =
  "AZ29JKSz9rfhsLWVMqBtHCzGbAm4IRADlPYTobLFPOV6YcGOP5Oq1_3fADVl4lbaUqSORT08AvWjqIxQ";
