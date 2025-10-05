import api from "@/lib/api";
import { Cart, ApiResponse } from "@/types";

export const cartService = {
  async getCart(): Promise<Cart> {
    try {
      const response = await api.get<ApiResponse<Cart>>("/api/cart");
      return response.data.data!;
    } catch (error: any) {
      // If cart doesn't exist or is empty, return a default empty cart structure
      if (error.response?.status === 404) {
        return {
          _id: "",
          userId: undefined,
          sessionId: "",
          items: [],
          totalAmount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        };
      }
      throw error;
    }
  },

  async addToCart(productId: string, quantity: number = 1): Promise<Cart> {
    const response = await api.post<ApiResponse<Cart>>("/api/cart/items", {
      productId,
      quantity,
    });
    return response.data.data!;
  },

  async updateCartItem(productId: string, quantity: number): Promise<Cart> {
    const response = await api.put<ApiResponse<Cart>>(
      `/api/cart/items/${productId}`,
      {
        quantity,
      }
    );
    return response.data.data!;
  },

  async removeFromCart(productId: string): Promise<Cart> {
    const response = await api.delete<ApiResponse<Cart>>(
      `/api/cart/items/${productId}`
    );
    return response.data.data!;
  },

  async clearCart(): Promise<Cart> {
    const response = await api.delete<ApiResponse<Cart>>("/api/cart");
    return response.data.data!;
  },
};
