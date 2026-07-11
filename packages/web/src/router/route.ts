import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/admin/student"
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index.vue"),
    meta: { title: "登录", requiresAuth: false }
  },
  {
    path: "/admin",
    name: "admin",
    component: () => import("@/views/layout/index.vue"),
    meta: { title: "后台管理", requiresAuth: true },
    children: [
      {
        path: "student",
        name: "student",
        component: () => import("@/views/admin/student/index.vue"),
        meta: { title: "学生管理" }
      },
      {
        path: "order",
        name: "order",
        component: () => import("@/views/admin/order/index.vue"),
        meta: { title: "订单管理" }
      },
      {
        path: "employee",
        name: "employee",
        component: () => import("@/views/admin/employee/index.vue"),
        meta: { title: "员工管理" }
      },
      {
        path: "upload",
        name: "upload",
        component: () => import("@/views/admin/upload/index.vue"),
        meta: { title: "上传文件" }
      },
      {
        path: "dictionary",
        name: "dictionary",
        component: () => import("@/views/admin/dictionary/index.vue"),
        meta: { title: "字典管理" }
      },
      {
        path: "documents",
        name: "documents",
        component: () => import("@/views/admin/documents/index.vue"),
        meta: { title: "文书管理" }
      }
    ]
  }
];

export default routes;
