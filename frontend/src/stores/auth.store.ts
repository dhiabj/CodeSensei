import { defineStore } from "pinia";
import { authService } from "@/services/auth.service";

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
    setIsAuthenticated(value: boolean) {
      this.isAuthenticated = value;
    },
    async logout() {
      try {
        await authService.logout();
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        window.location.href = "/";
      }
    },
    async initialize() {
      try {
        this.isInitializing = true;
        await authService.getProfile();
        this.isInitialized = true;
        this.isAuthenticated = true;
      } catch {
        this.isAuthenticated = false;
      } finally {
        this.isInitialized = true;
        this.isInitializing = false;
      }
    },
  },
});
