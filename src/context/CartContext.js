"use client"
import { createContext, useContext, useState } from "react";
import api from "@/lib/axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

    if (!token || role !== "CUSTOMER") {
      setCartCount(0);
      return;
    }

    try {
      const res = await api.get("/customer/cart/count");
      setCartCount(res.data.count || 0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartCount,
        setCartCount,
        fetchCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
