"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Product, CartItem } from "@/types";

interface CartContextType {
  cartItems: CartItem[];
  wishlistItems: Product[];
  addToCart: (product: Product, color: string, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  const addToCart = useCallback((product: Product, color: string, qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (i) => i.product.id === product.id && i.selectedColor === color
      );
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && i.selectedColor === color
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [...prev, { product, quantity: qty, selectedColor: color }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i))
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCartItems([]), []);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlistItems((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      return exists ? prev.filter((p) => p.id !== product.id) : [...prev, product];
    });
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => wishlistItems.some((p) => p.id === productId),
    [wishlistItems]
  );

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.sellingPrice * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
