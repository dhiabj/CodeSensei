import { authService } from "@/services/auth.service";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("authToken") || null,
    isAuthenticated: false,
    isLoading: false,
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
      if (this.isLoading) return;
      this.isLoading = true;
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
      } finally {
        this.isLoading = false;
      }
    },
  },
});
