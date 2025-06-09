// Import the Axios library to make HTTP requests. Axios is a popular JavaScript library for this purpose.
import axios from "axios";
import { API_BASE_URL } from "./constants";

// Create an instance of Axios and store it in the 'apiInstance' variable. This instance will have specific configuration options.
const apiInstance = axios.create({
  // Set the base URL for this instance. All requests made using this instance will have this URL as their starting point.
  baseURL: "https://desirable-communication-production.up.railway.app/api/v1/",

  // Set a timeout for requests made using this instance. If a request takes longer than 5 seconds to complete, it will be canceled.
  timeout: 100000, // timeout after 5 seconds

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

// Export the 'apiInstance' so that it can be used in other parts of the codebase. Other modules can import and use this Axios instance for making API requests.
export default apiInstance;
