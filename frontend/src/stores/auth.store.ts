import { defineStore } from "pinia";
import { api } from "@/api";
import router from "@/router";

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
