import { createRouter, createWebHashHistory } from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
NProgress.configure({ showSpinner: false }); // NProgress Configuration 刷新页面头部进度条

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: () => import("@/views/homeView/index.vue"),
    },
    {
      path: "/profile",
      component: () => import("@/views/profileView/index.vue"),
    },
    {
      path: "/experience",
      component: () => import("@/views/experienceView/index.vue"),
    },
    {
      path: "/gallery",
      component: () => import("@/views/galleryView/index.vue"),
    },
    {
      path: "/message-board",
      component: () => import("@/views/messageBoard/index.vue"),
    },
    {
      path: "/chat",
      component: () => import("@/views/chatView/index.vue"),
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
