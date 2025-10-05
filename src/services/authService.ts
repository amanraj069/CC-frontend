import api from "@/lib/api";
import { User, ApiResponse } from "@/types";

export interface LoginCredentials {
  email: string;
  password: string;
  role?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export const authService = {
  async login(
    credentials: LoginCredentials
  ): Promise<{ user: User; token: string }> {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>(
      "/api/auth/login",
      credentials
    );
    return response.data.data!;
  },

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>(
      "/api/auth/register",
      data
    );
    return response.data.data!;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<ApiResponse<User>>("/api/auth/profile");
    return response.data.data!;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put<ApiResponse<User>>(
      "/api/auth/profile",
      data
    );
    return response.data.data!;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};
