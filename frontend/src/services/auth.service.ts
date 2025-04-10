import { api } from "@/api";

interface AuthCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
}

interface SignupResponse {
  message: string;
}

export const authService = {
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  async register(credentials: AuthCredentials): Promise<SignupResponse> {
    const response = await api.post<SignupResponse>("/auth/register", credentials);
    return response.data;
  },
};
