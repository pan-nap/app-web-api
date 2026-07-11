import type { App } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import routes from "./route";
import { useUserStore } from "@/stores/user";

const router = createRouter({
  history: createWebHistory("/"),
  routes
});

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth !== false);

  const isLoggedIn = await userStore.isLoggedIn();
  if (requiresAuth && !isLoggedIn) {
    next("/login");
  } else if (to.path === "/login" && isLoggedIn) {
    next("/");
  } else {
    next();
  }
});

router.afterEach((to) => {
  document.title = (to.meta.title as string) || "后台管理系统";
});

export function setupRouter(app: App) {
  app.use(router);
  return router.isReady();
}

export default router;
