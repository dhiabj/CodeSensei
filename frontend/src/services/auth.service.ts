import axios from "axios";

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

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const authService = {
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_URL}/api/user/login`, credentials);
    return response.data;
  },

  async register(credentials: AuthCredentials): Promise<SignupResponse> {
    const response = await axios.post<SignupResponse>(`${API_URL}/api/user/register`, credentials);
    console.log(response);
    return response.data;
  },
};
