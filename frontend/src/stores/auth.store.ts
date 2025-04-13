import { defineStore } from "pinia";
import { api } from "@/api";
import router from "@/router";
import { authService, type AuthCredentials } from "@/services/auth.service";

interface AuthState {
  isInitialized: boolean;
  isInitializing: boolean;
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    isInitialized: false,
    isInitializing: false,
    isAuthenticated: false,
  }),
  actions: {
    async login(values: AuthCredentials) {
      const response = await authService.login(values);
      this.isAuthenticated = true;
      router.push("/");
      return response.message;
    },
    async logout() {
      try {
        await api.post("/auth/logout");
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        this.isAuthenticated = false;
        router.push("/login");
      }
    },
    async initialize() {
      try {
        this.isInitializing = true;
        await api.get("/auth/protected");
        this.isInitialized = true;
        this.isAuthenticated = true;
      } catch (error) {
        this.isAuthenticated = false;
      } finally {
        this.isInitialized = true;
        this.isInitializing = false;
      }
    },
  },
});
