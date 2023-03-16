/* eslint-disable */
import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

// deploy test #4
export default new Router({
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
        path: "/students"
        ,name: "student-s"
        ,component: () => import('./components/Students')
    },
    {
      path: "/student"
      ,name: "student-details"
      ,component: () => import('./components/StudentDetails')
    },
    {
      path: "/student/:id"
      ,name: "student-edit"
      ,component: () => import('./components/StudentEdit')
    },
  ],
});
