import api from "@/lib/api";
import { Product, ApiResponse } from "@/types";

export const productService = {
  async getAllProducts(params?: {
    category?: string;
    search?: string;
    limit?: number;
    page?: number;
  }): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await api.get<
      ApiResponse<{
        products: Product[];
        total: number;
        page: number;
        limit: number;
      }>
    >("/api/products", { params });
    return response.data.data!;
  },

  async getProductById(id: string): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(`/api/products/${id}`);
    return response.data.data!;
  },

  async createProduct(productData: {
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    stock: number;
    isActive: boolean;
  }): Promise<Product> {
    const response = await api.post<ApiResponse<Product>>(
      "/api/products",
      productData
    );
    return response.data.data!;
  },

  async updateProduct(
    id: string,
    productData: Partial<Product>
  ): Promise<Product> {
    const response = await api.put<ApiResponse<Product>>(
      `/api/products/${id}`,
      productData
    );
    return response.data.data!;
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/api/products/${id}`);
  },

  async getCategories(): Promise<string[]> {
    const response = await api.get<ApiResponse<string[]>>(
      "/api/products/categories"
    );
    return response.data.data!;
  },
};
