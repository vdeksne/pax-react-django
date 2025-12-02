// Use environment variable for API base URL, fallback to localhost for development
// In production, set VITE_API_BASE_URL in your deployment platform (e.g., Netlify)
// Example: VITE_API_BASE_URL=https://desirable-communication-production.up.railway.app/api/v1/
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1/";
export const PAYPAL_CLIENT_ID =
  "AZ29JKSz9rfhsLWVMqBtHCzGbAm4IRADlPYTobLFPOV6Oq1_3fADVl4lbaUqSORT08AvWjqIxQ";
export const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ||
  "desirable-communication-production.up.railway.app";
