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
      name: "home-page",
      component: () => import("./components/Homepage"),
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
    },
    {
      path: "/events"
      ,name: 'event-s'
      ,component: () => import('./components/Events')
    },
    {
      path: "/critique"
      ,name: 'critique-f'
      ,component: () => import('./components/MakeHearingCritique')
    }
  ]
});
