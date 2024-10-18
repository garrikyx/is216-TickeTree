import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/marketplace",
      name: "marketplace",
      // route level code-splitting
      component: () => import("../views/Marketplace.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/Login.vue"),
      meta: { hideNavbar: true, hideFooter: true },
    },
    {
      path: "/myevents",
      name: "myevent",
      component: () => import("../views/MyEvent.vue"),
    },
  ],
});

export default router;
