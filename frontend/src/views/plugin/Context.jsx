import React, { createContext, useContext, useState, useCallback } from "react";
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

  const fetchCartCount = useCallback(async () => {
    if (!cart_id || isLoading) return;

    try {
      setIsLoading(true);
      const url = userData?.user_id
        ? `cart-list/${cart_id}/${userData?.user_id}/`
        : `cart-list/${cart_id}/`;
      const response = await axios.get(url);
      setCartCount(response.data.length);
    } catch (error) {
      console.error("Error fetching cart count:", error);
    } finally {
      setIsLoading(false);
    }
  }, [cart_id, userData?.user_id, axios, isLoading]);

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
