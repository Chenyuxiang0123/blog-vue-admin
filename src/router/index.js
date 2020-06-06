import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/main"
  },
  {
    path: "/main",
    name: "Main",
    meta: { title: "首页" },
    component: () => import("../views/main/index")
  },
  {
    path: "/login",
    name: "Login",
    meta: { title: "login" },
    component: () => import("../views/login/index")
  },
  {
    path: "/register",
    name: "Register",
    meta: { title: "register" },
    component: () => import("../views/register/index")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
