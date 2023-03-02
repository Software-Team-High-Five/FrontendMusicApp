import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { createPinia, PiniaVuePlugin } from "pinia";
import store from "./stores/userStore"; //added this from tutorial

Vue.use(PiniaVuePlugin);
const pinia = createPinia();

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  pinia,
  store,
  render: (h) => h(App),
}).$mount("#app");
