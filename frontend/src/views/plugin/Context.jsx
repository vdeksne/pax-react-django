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

  // Memoize user_id to prevent unnecessary re-renders
  const userId = useMemo(() => userData?.user_id || null, [userData?.user_id]);

  const fetchCartCount = useCallback(async () => {
    if (!cart_id || fetchingRef.current) return;

    // Check if we've already fetched for this combination
    if (
      lastFetchRef.current.cart_id === cart_id &&
      lastFetchRef.current.user_id === userId
    ) {
      return;
    }

    try {
      fetchingRef.current = true;
      setIsLoading(true);
      const url = userId
        ? `cart-list/${cart_id}/${userId}/`
        : `cart-list/${cart_id}/`;
      const response = await axios.get(url, { timeout: 15000 }); // 15 second timeout for cart
      setCartCount(response.data.length);
      lastFetchRef.current = { cart_id, user_id: userId };
    } catch (error) {
      // Silently handle cart count errors - don't break the app
      if (error.code !== "ECONNABORTED" && error.code !== "ERR_NETWORK") {
        console.warn("Error fetching cart count:", error);
      }
      // Keep cart count at 0 if fetch fails
      setCartCount(0);
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
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

    // Use a timeout to debounce rapid changes
    const timeoutId = setTimeout(async () => {
      if (fetchingRef.current) return;

      try {
        fetchingRef.current = true;
        setIsLoading(true);
        const url = userId
          ? `cart-list/${cart_id}/${userId}/`
          : `cart-list/${cart_id}/`;
        const response = await axios.get(url);
        setCartCount(response.data.length);
        lastFetchRef.current = { cart_id, user_id: userId };
      } catch (error) {
        console.error("Error fetching cart count:", error);
      } finally {
        setIsLoading(false);
        fetchingRef.current = false;
      }
    }, 300);

    return () => clearTimeout(timeoutId);
    // Only depend on cart_id and userId
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart_id, userId]);

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
