import { createRouter, createWebHistory } from "vue-router";
import NProgress from "nprogress";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import { useAuthStore } from "@/stores/auth.store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/:id?",
      name: "home",
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { requiresGuest: true },
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
      meta: { requiresGuest: true },
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
      meta: { requiresAuth: false },
    },
  ],
});

router.beforeEach(async (to, _, next) => {
  NProgress.start();
  const authStore = useAuthStore();
  try {
    await authStore.checkAuthentication();
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next({ name: "login" });
    } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
      next({ name: "home" });
    } else {
      next();
    }
  } catch (error) {
    console.error("Navigation error:", error);
    next(false);
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
