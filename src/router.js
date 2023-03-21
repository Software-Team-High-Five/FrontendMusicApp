/* eslint-disable */
import Vue from "vue";
import Router from "vue-router";
import { pinia } from "@/main";
import { useUserStore } from "@/stores/userStore";
Vue.use(Router);

// deploy test #4
// export default new Router({
const router = new Router({
  base: process.env.NODE_ENV === "development" ? "/" : "/performance/t5",
  mode: "history",
  routes: [
    {
      path: "/",
      alias: "/home",
      name: "home-page",
      component: () => import("./components/Homepage"),
    },
    {
      path: "/newevent",
      name: "new-event",
      component: () => import("./components/NewEvent"),
    },
    {
      path: "/events/:eventId/signup",
      name: "sign-up",
      component: () => import("./components/SignUp"),
    },
    {
      path: "/performance/:performanceId",
      name: "view-performance",
      component: () => import("./components/ViewPerformance"),
    },
    {
      path: "/allevents",
      name: "all-events",
      component: () => import("./components/AllEvents"),
    },
    {
      path: "/event/:eventId",
      name: "event-details",
      component: () => import("./components/EventDetails"),
    },
    {
      path: "/student",
      name: "student-details",
      component: () => import("./components/StudentDetails"),
    },
    {
      path: "/student/:id",
      name: "student-edit",
      component: () => import("./components/StudentEdit"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("./components/Login"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const userStore = useUserStore(pinia);
  console.log(userStore);
  const user = userStore.name;
  console.log(user);
  if (user === null && to.path !== "/") {
    return next({
      path: "/",
    });
  } else {
    next();
  }
});

export default router;
