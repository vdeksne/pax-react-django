// Import the Axios library to make HTTP requests. Axios is a popular JavaScript library for this purpose.
import axios from "axios";
import { API_BASE_URL } from "./constants";

// Create an instance of Axios and store it in the 'apiInstance' variable. This instance will have specific configuration options.
const apiInstance = axios.create({
  // Set the base URL for this instance. All requests made using this instance will have this URL as their starting point.
  baseURL: API_BASE_URL,

  // Set a timeout for requests made using this instance. Increased to 20 seconds for slower connections.
  timeout: 20000, // timeout after 20 seconds

  // Define headers that will be included in every request made using this instance.
  headers: {
    Accept: "application/json", // The request expects a response in JSON format.
  },
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
    // Handle timeout errors specifically
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      console.warn("Request timeout - server may be slow or unreachable");
      // Don't throw - let individual components handle the error
    }
    // Handle network errors
    if (error.code === "ERR_NETWORK" || !error.response) {
      console.warn("Network error - check backend connection");
    }
    return Promise.reject(error);
  }
);

// Export the 'apiInstance' so that it can be used in other parts of the codebase. Other modules can import and use this Axios instance for making API requests.
export default apiInstance;
