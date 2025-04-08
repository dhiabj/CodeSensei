import { authService } from "@/services/auth.service";
import { defineStore } from "pinia";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    token: localStorage.getItem("authToken") || null,
    isAuthenticated: false,
  }),
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem("authToken", token);
    },
    logout() {
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem("authToken");
    },
    async checkAuthentication() {
      try {
        if (!this.token) {
          this.isAuthenticated = false;
          return;
        }
        const isValid = await authService.checkToken();
        this.isAuthenticated = isValid;
        if (!isValid) {
          this.logout();
        }
      } catch (error) {
        this.logout();
      }
    },
  },
});
