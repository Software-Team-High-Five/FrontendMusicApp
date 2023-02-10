import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

// deploy test #4
export default new Router({
  base: process.env.NODE_ENV === 'development' ? "/" : "/performance/t5",
  mode: "history",
  routes: [
    {
      path: "/"
      ,alias: "/courses"
      ,name: "courses"
      ,component: () => import("./components/CourseList")
    },
    {
      path: "/newevent"
      ,name: "new-event"
      ,component: () => import("./components/NewEvent")
    },
    {
      path: "/events/:eventId/signup"
      ,name: "sign-up"
      ,component: () => import("./components/SignUp")
    }
  ]
});