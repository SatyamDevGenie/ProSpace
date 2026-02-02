import { api } from "./api";
import type { AuthResponse, LoginCredentials, RegisterCredentials } from "@/types";

export const authService = {
  register: async (data: RegisterCredentials): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/register", data);
    return res.data;
  },
  login: async (data: LoginCredentials): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/login", data);
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
    return res.data;
  },
  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
    localStorage.removeItem("token");
  },
};
