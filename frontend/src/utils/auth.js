// Importing the useAuthStore hook from the '../store/auth' file to manage authentication state
import { useAuthStore } from "../store/auth";

// Importing the axios library for making HTTP requests
import axios from "./axios";

// Importing jwt_decode to decode JSON Web Tokens
import jwt_decode from "jwt-decode";

// Importing the Cookies library to handle browser cookies
import Cookies from "js-cookie";

// Importing Swal (SweetAlert2) for displaying toast notifications
import Swal from "sweetalert2";

// Configuring global toast notifications using Swal.mixin
const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});

// Function to handle user login
export const login = async (email, password) => {
  try {
    const { data } = await axios.post("user/token/", {
      email,
      password,
    });

    if (data?.access && data?.refresh) {
      setAuthUser(data.access, data.refresh);

      Toast.fire({
        icon: "success",
        title: "Signed in successfully",
      });

      return { data, error: null };
    }
    return { data: null, error: "Invalid response from server" };
  } catch (error) {
    return {
      data: null,
      error: error.response?.data?.detail || "Something went wrong",
    };
  }
};

// Function to handle user registration
export const register = async (fullname, email, phone, password, password2) => {
  try {
    const { data } = await axios.post("user/register/", {
      fullname,
      email,
      phone,
      password,
      password2,
    });

    if (data?.access && data?.refresh) {
      setAuthUser(data.access, data.refresh);

      Toast.fire({
        icon: "success",
        title: "Registered successfully",
      });

      return { data, error: null };
    }
    return { data: null, error: "Invalid response from server" };
  } catch (error) {
    return {
      data: null,
      error: error.response?.data?.detail || "Something went wrong",
    };
  }
};

// Function to handle user logout
export const logout = () => {
  // Removing access and refresh tokens from cookies, resetting user state, and displaying success toast
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  useAuthStore.getState().logout();

  // Displaying a success toast notification
  Toast.fire({
    icon: "success",
    title: "Logged out successfully",
  });
};

// Function to set the authenticated user on page load
export const setUser = async () => {
  const accessToken = Cookies.get("access_token");
  const refreshToken = Cookies.get("refresh_token");

  if (!accessToken || !refreshToken) {
    useAuthStore.getState().logout();
    return;
  }

  if (isAccessTokenExpired(accessToken)) {
    try {
      const response = await getRefreshToken(refreshToken);
      if (response?.access) {
        setAuthUser(response.access, response.refresh);
      } else {
        logout();
      }
    } catch (error) {
      logout();
    }
  } else {
    setAuthUser(accessToken, refreshToken);
  }
};

// Function to set the authenticated user and update user state
export const setAuthUser = (access_token, refresh_token) => {
  try {
    Cookies.set("access_token", access_token, {
      expires: 1,
      secure: true,
    });

    Cookies.set("refresh_token", refresh_token, {
      expires: 7,
      secure: true,
    });

    const user = jwt_decode(access_token);
    if (user) {
      useAuthStore.getState().setUser(user);
    }
  } catch (error) {
    console.error("Error setting auth user:", error);
    logout();
  }
};

// Function to refresh the access token using the refresh token
export const getRefreshToken = async (refresh_token) => {
  const { data } = await axios.post("user/token/refresh/", {
    refresh: refresh_token,
  });
  return data;
};

// Function to check if the access token is expired
export const isAccessTokenExpired = (token) => {
  try {
    const decoded = jwt_decode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};
