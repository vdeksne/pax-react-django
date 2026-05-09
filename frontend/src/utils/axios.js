// Import the Axios library to make HTTP requests. Axios is a popular JavaScript library for this purpose.
import axios from "axios";
import { API_BASE_URL } from "./constants";

// Create an instance of Axios and store it in the 'apiInstance' variable. This instance will have specific configuration options.
const apiInstance = axios.create({
  // Uses API_BASE_URL from constants (local demo or production).
  baseURL: API_BASE_URL,

  // Set a timeout for requests made using this instance. Increased to 60 seconds for slower connections/backend.
  timeout: 60000, // timeout after 60 seconds

  // Define headers that will be included in every request made using this instance.
  headers: {
    Accept: "application/json", // The request expects a response in JSON format.
  },
  // Don't send credentials by default to avoid CORS issues
  withCredentials: false,
});

// Add a request interceptor to set the correct Content-Type header based on the data type
apiInstance.interceptors.request.use((config) => {
  // If the data is FormData, don't set Content-Type header (browser will set it automatically with boundary)
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else {
    // For JSON data, set Content-Type to application/json
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

// Add a response interceptor to handle errors gracefully
apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detailed error info in development
    if (import.meta.env.DEV) {
      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        console.debug("Request timeout:", error.config?.url);
      }
      if (error.code === "ERR_NETWORK" || !error.response) {
        console.debug(
          "Network error - backend may be down:",
          error.config?.url
        );
        console.debug("Error details:", {
          code: error.code,
          message: error.message,
          baseURL: error.config?.baseURL,
        });
      }
      // Log CORS errors specifically
      if (
        error.message?.includes("CORS") ||
        error.message?.includes("blocked")
      ) {
        console.error("CORS Error detected:", error.message);
        console.error("Request URL:", error.config?.url);
        console.error("Origin:", window.location.origin);
      }
    }
    // Always reject so components can handle errors appropriately
    return Promise.reject(error);
  }
);

// Export the 'apiInstance' so that it can be used in other parts of the codebase. Other modules can import and use this Axios instance for making API requests.
export default apiInstance;
