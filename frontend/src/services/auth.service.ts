import { api } from "@/api";
import type { AuthCredentials, AuthResponse, User } from "@/types/auth.types";

export const authService = {
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  async register(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", credentials);
    return response.data;
  },

  async refreshToken(): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/refresh");
    return response.data;
  },

  async logout(): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/logout");
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>("/auth/profile");
    return response.data;
  },

  googleLogin() {
    window.location.href = `${api.defaults.baseURL}/auth/google`;
  },

  githubLogin() {
    window.location.href = `${api.defaults.baseURL}/auth/github`;
  },
};
