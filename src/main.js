import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { createPinia, PiniaVuePlugin } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";

Vue.use(PiniaVuePlugin);
export const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

Vue.config.productionTip = false;

Vue.use(router);

new Vue({
  router,
  vuetify,
  pinia,
  //store,
  render: (h) => h(App),
}).$mount("#app");
