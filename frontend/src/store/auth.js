// Import the 'create' function from the 'zustand' library.
import { create } from "zustand";

// Import the 'mountStoreDevtool' function from the 'simple-zustand-devtools' library
import { mountStoreDevtool } from "simple-zustand-devtools";

// Import the 'persist' function from the 'zustand/middleware' library
import { persist } from "zustand/middleware";

// Create a custom Zustand store named 'useAuthStore' using the 'create' function and 'persist' middleware.
const useAuthStore = create(
  persist(
    (set, get) => ({
      // Define the 'allUserData' state variable and initialize it to null.
      allUserData: null, // Use this to store all user data

      // Define the 'loading' state variable and initialize it to false.
      loading: false,

      // Define a function 'user' that returns an object with user-related data.
      user: () => {
        const userData = get().allUserData;
        return {
          user_id: userData?.user_id || null,
          username: userData?.username || null,
          vendor_id: userData?.vendor_id || null,
          email: userData?.email || null,
        };
      },

      // Define a function 'setUser' that allows setting the 'allUserData' state.
      setUser: (user) => {
        set({ allUserData: user });
      },

      // Define a function 'setLoading' that allows setting the 'loading' state.
      setLoading: (loading) => set({ loading }),

      // Define a function 'isLoggedIn' that checks if 'allUserData' is not null.
      isLoggedIn: () => {
        const userData = get().allUserData;
        return Boolean(userData?.user_id);
      },

      logout: () => {
        set({ allUserData: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ allUserData: state.allUserData }),
    }
  )
);

// Conditionally attach the DevTools only in a development environment.
if (import.meta.env.DEV) {
  mountStoreDevtool("Store", useAuthStore);
}

// Export the 'useAuthStore' for use in other parts of the application.
export { useAuthStore };
