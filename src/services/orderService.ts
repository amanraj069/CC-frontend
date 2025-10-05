import api from "@/lib/api";
import { Order, Address, ApiResponse } from "@/types";

export interface CreateOrderData {
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: "credit_card" | "debit_card" | "paypal";
}

export const orderService = {
  async createOrder(data: CreateOrderData): Promise<Order> {
    const response = await api.post<ApiResponse<Order>>("/api/orders", data);
    return response.data.data!;
  },

  async getUserOrders(params?: { page?: number; limit?: number }): Promise<{
    orders: Order[];
    page: number;
    limit: number;
  }> {
    const response = await api.get<
      ApiResponse<{
        orders: Order[];
        page: number;
        limit: number;
      }>
    >("/api/orders", { params });
    return response.data.data!;
  },

  async getOrderById(id: string): Promise<Order> {
    const response = await api.get<ApiResponse<Order>>(`/api/orders/${id}`);
    return response.data.data!;
  },

  async cancelOrder(id: string): Promise<Order> {
    const response = await api.put<ApiResponse<Order>>(
      `/api/orders/${id}/cancel`
    );
    return response.data.data!;
  },
};
