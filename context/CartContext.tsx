"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Product, CartItem } from "@/types";
import { addWishlistApi, getWishlistApi } from "@/services/wishlist.service";
import { addToCartApi } from "@/services/cart.service";
import { toast } from "react-toastify";

interface CartContextType {
  cartItems: CartItem[];
  wishlistItems: any[];
  wishlistLoading: boolean;
  addToCart: (product: any, color: string, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: any) => void;
  isInWishlist: (productId: string) => boolean;
  fetchWishlist: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // ✅ Wishlist fetch on mount
  const fetchWishlist = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setWishlistLoading(true);
    const response: any = await getWishlistApi({ page: 1, limit: 100 });
    if (response?.success) {
      setWishlistItems(response.data);
    }
    setWishlistLoading(false);
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const addToCart = useCallback(async (product: any, color: string, qty = 1) => {
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please login to add to cart"); return; }

    const response: any = await addToCartApi({ product: product.id });
    if (response?.success) {
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
      toast.success(response.message);
    } else {
      toast.error(response?.message || "Something went wrong");
    }
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, qty: number) => {
    if (qty <= 0) { removeFromCart(productId); return; }
    setCartItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i))
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCartItems([]), []);

  const toggleWishlist = useCallback(async (product: any) => {
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please login to add to wishlist"); return; }

    const response: any = await addWishlistApi({ product: product.id });
    if (response?.success) {
      // ✅ Refetch latest wishlist from API
      fetchWishlist();
      toast.success(response.message);
    } else {
      toast.error(response?.message || "Something went wrong");
    }
  }, [fetchWishlist]);

  // ✅ productId se check karo — API data mein productId field hai
  const isInWishlist = useCallback(
    (productId: string) => wishlistItems.some((p) => p.productId?.toString() === productId?.toString()),
    [wishlistItems]
  );

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.sellingPrice * item.quantity, 0
  );
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems, wishlistItems, wishlistLoading,
      addToCart, removeFromCart, updateQuantity, clearCart,
      toggleWishlist, isInWishlist, fetchWishlist,
      cartTotal, cartCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}