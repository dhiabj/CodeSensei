import { api } from "@/api";

export interface AuthCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  message: string;
}

export const authService = {
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  async register(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", credentials);
    return response.data;
  },
};
