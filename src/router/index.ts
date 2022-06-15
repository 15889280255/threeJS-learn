import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "菜单",
    redirect: "/demo1",
  },
  {
    path: "/demo1",
    name: "正方体",
    component: () => import("../views/Demo1.vue"),
  },
  {
    path: "/demo2",
    name: "正方体2",
    component: () => import("../views/Demo2.vue"),
  },
  {
    path: "/demo3",
    name: "3D文字3",
    component: () => import("../views/Demo3Text.vue"),
  },
  {
    path: "/demo4",
    name: "测试",
    component: () => import("../views/Demo4.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
