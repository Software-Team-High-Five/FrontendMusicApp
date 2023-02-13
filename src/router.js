import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

// deploy test #4
export default new Router({
  base:
    process.env.NODE_ENV === "development"
      ? "/"
      : "/performance/t5",
  mode: "history",
  routes: [
    {
      path: "/",
      alias: "/home",
      name: "home page",
      component: () => import("./components/Homepage"),
    }
  ],
});
