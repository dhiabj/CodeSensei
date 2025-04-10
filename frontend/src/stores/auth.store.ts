import { defineStore } from "pinia";
import router from "@/router";
import { api } from "@/api";

interface AuthState {
  token: string | null;
  isInitialized: boolean;
  isInitializing: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    token: localStorage.getItem("authToken") || null,
    isInitialized: false,
    isInitializing: false,
  }),
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem("authToken", token);
    },
    clearToken() {
      this.token = null;
      localStorage.removeItem("authToken");
      delete api.defaults.headers.common["Authorization"];
    },
    logout() {
      this.clearToken();
      router.push("/login");
    },
    async initialize() {
      this.isInitializing = true;
      try {
        if (!this.token) {
          this.isInitialized = true;
          return;
        }
        await api.get("/auth/check-token");
        this.isInitialized = true;
      } catch (error) {
        this.clearToken();
        this.isInitialized = true;
      } finally {
        this.isInitializing = false;
      }
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
  },
});
