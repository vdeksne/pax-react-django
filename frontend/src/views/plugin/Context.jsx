import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import apiInstance from "../../utils/axios";
import { isStaticDemo } from "../../utils/staticDemo";
import UserData from "./UserData";
import CartID from "./cartID";

// Cart Context
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const axios = apiInstance;
  const userData = UserData();
  const cart_id = CartID();
  const fetchingRef = useRef(false);
  const lastFetchRef = useRef({ cart_id: null, user_id: null });
  const abortControllerRef = useRef(null);

  // Memoize user_id to prevent unnecessary re-renders
  const userId = useMemo(() => userData?.user_id || null, [userData?.user_id]);

  const fetchCartCount = useCallback(async () => {
    if (isStaticDemo()) {
      setCartCount(0);
      return;
    }
    if (!cart_id || fetchingRef.current) return;

    // Check if we've already fetched for this combination
    if (
      lastFetchRef.current.cart_id === cart_id &&
      lastFetchRef.current.user_id === userId
    ) {
      return;
    }

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      fetchingRef.current = true;
      // Don't set loading state - cart count is non-critical
      const url = userId
        ? `cart-list/${cart_id}/${userId}/`
        : `cart-list/${cart_id}/`;
      // Increased timeout for cart count to allow backend more time
      const response = await axios.get(url, {
        timeout: 30000, // 30 second timeout
        signal: abortController.signal,
      });

      // Only update if request wasn't aborted
      if (!abortController.signal.aborted) {
        setCartCount(response.data.length);
        lastFetchRef.current = { cart_id, user_id: userId };
      }
    } catch (error) {
      // Completely silent on timeout/network/abort errors - cart count is non-critical
      // Only log unexpected server errors (4xx, 5xx)
      if (
        error.response &&
        error.code !== "ECONNABORTED" &&
        error.code !== "ERR_NETWORK" &&
        error.name !== "AbortError" &&
        error.name !== "CanceledError"
      ) {
        console.warn("Error fetching cart count:", error.response.status);
      }
      // Keep cart count at 0 if fetch fails - don't break the app
      if (!abortController.signal.aborted) {
        setCartCount(0);
      }
    } finally {
      fetchingRef.current = false;
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }
    }
    // Remove axios and isLoading from dependencies to prevent loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart_id, userId]);

  // Auto-fetch cart count when cart_id or user_id changes
  useEffect(() => {
    if (!cart_id) return;

    // Check if we've already fetched for this combination
    if (
      lastFetchRef.current.cart_id === cart_id &&
      lastFetchRef.current.user_id === userId
    ) {
      return;
    }

    // Use a timeout to debounce rapid changes and make it non-blocking
    const timeoutId = setTimeout(() => {
      // Call fetchCartCount which has proper error handling
      fetchCartCount();
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      // Cancel any pending request when component unmounts or dependencies change
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
    // Only depend on cart_id, userId, and fetchCartCount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart_id, userId, fetchCartCount]);

  const updateCartCount = useCallback(async () => {
    await fetchCartCount();
  }, [fetchCartCount]);

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

// Profile Context
export const ProfileContext = createContext();
