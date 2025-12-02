// Use environment variable for API base URL, fallback to localhost for development
// In production, set VITE_API_BASE_URL in your deployment platform (e.g., Netlify)
// Example: VITE_API_BASE_URL=https://desirable-communication-production.up.railway.app/api/v1/
const API_BASE_URL_VALUE =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1/";

// Log the API URL in development to help debug
if (import.meta.env.DEV) {
  console.log("API Base URL:", API_BASE_URL_VALUE);
  console.log(
    "Environment variable VITE_API_BASE_URL:",
    import.meta.env.VITE_API_BASE_URL
  );
}

export const API_BASE_URL = API_BASE_URL_VALUE;
export const PAYPAL_CLIENT_ID =
  "AZ29JKSz9rfhsLWVMqBtHCzGbAm4IRADlPYTobLFPOV6Oq1_3fADVl4lbaUqSORT08AvWjqIxQ";
export const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ||
  "desirable-communication-production.up.railway.app";
