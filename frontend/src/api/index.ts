import { useAuthStore } from "@/stores/auth.store";
import axios from "axios";

export const API_URL = import.meta.env.VITE_BACKEND_URL;

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});

const NO_REFRESH_URLS = ["/auth/login", "/auth/refresh"];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthEndpoint = NO_REFRESH_URLS.some((url) => originalRequest.url?.includes(url));

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh tokens
        await api.post("/auth/refresh");

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        const authStore = useAuthStore();
        if (authStore.isAuthenticated) {
          await authStore.logout();
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
