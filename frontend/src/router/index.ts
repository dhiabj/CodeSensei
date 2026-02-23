import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import { useAuthStore } from "@/stores/auth.store";
import ReviewView from "@/views/ReviewView.vue";
import AuthSuccessView from "@/views/AuthSuccessView.vue";
import VerifyEmailView from "@/views/VerifyEmailView.vue";
import ResendVerificationView from "@/views/ResendVerificationView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { requiresAuth: false, showSidebar: true },
    },
    {
      path: "/review/:id",
      name: "review",
      component: ReviewView,
      meta: { requiresAuth: true, showSidebar: true },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { requiresGuest: true, showSidebar: false },
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
      meta: { requiresGuest: true, showSidebar: false },
    },
    {
      path: "/auth/success",
      name: "auth-success",
      meta: { requiresGuest: true, showSidebar: false },
      component: AuthSuccessView,
    },
    {
      path: "/verify-email",
      name: "verify-email",
      component: VerifyEmailView,
      meta: { requiresGuest: true, showSidebar: false },
    },
    {
      path: "/resend-verification",
      name: "resend-verification",
      component: ResendVerificationView,
      meta: { requiresGuest: true, showSidebar: false },
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
      meta: { requiresAuth: false, showSidebar: false },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Initialize auth state on first navigation
  if (!authStore.isInitialized) {
    await authStore.initialize();
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: "home" });
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: "home" });
  } else {
    next();
  }
});

export default router;
