"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Cart } from "@/types";
import { cartService } from "@/services/cartService";
import toast from "react-hot-toast";

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  itemCount: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const itemCount =
    cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;

  const refreshCart = async () => {
    try {
      const cartData = await cartService.getCart();
      setCart(cartData);
    } catch (error: any) {
      console.error("Error fetching cart:", error);
      // Only show error toasts for actual server errors, not empty cart scenarios
      if (error.response?.status !== 404 && error.response?.status !== 401) {
        const message = error.response?.data?.message || "Failed to load cart";
        toast.error(message);
      }
      // Set cart to null on error so UI shows empty state
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      const updatedCart = await cartService.addToCart(productId, quantity);
      setCart(updatedCart);
      toast.success("Item added to cart!");
    } catch (error: any) {
      console.error("Add to cart error:", error);
      const message =
        error.response?.data?.message || "Failed to add item to cart";
      toast.error(message);
      throw error;
    }
  };

  const updateCartItem = async (productId: string, quantity: number) => {
    try {
      const updatedCart = await cartService.updateCartItem(productId, quantity);
      setCart(updatedCart);

      if (quantity === 0) {
        toast.success("Item removed from cart");
      } else {
        toast.success("Cart updated");
      }
    } catch (error: any) {
      console.error("Update cart error:", error);
      const message = error.response?.data?.message || "Failed to update cart";
      toast.error(message);
      throw error;
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const updatedCart = await cartService.removeFromCart(productId);
      setCart(updatedCart);
      toast.success("Item removed from cart");
    } catch (error: any) {
      console.error("Remove from cart error:", error);
      const message = error.response?.data?.message || "Failed to remove item";
      toast.error(message);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const updatedCart = await cartService.clearCart();
      setCart(updatedCart);
      toast.success("Cart cleared");
    } catch (error: any) {
      console.error("Clear cart error:", error);
      const message = error.response?.data?.message || "Failed to clear cart";
      toast.error(message);
      throw error;
    }
  };

  const value = {
    cart,
    loading,
    itemCount,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
