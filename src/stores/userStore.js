import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", {
  state: () => {
    //user (userId, fName, lName, email, token)
    return { user: {} };
  },
  getters: {
    name: (state) =>
      state.user != null
        ? `${state.user.fName} ${state.user.lName}`
        : "Error: user not initialized",
    isFaculty: (state) => state.user != null && state.user.role === "faculty",
    isAdmin: (state) => state.user != null && state.user.role === "admin",
  },
  actions: {
    setUser(userData) {
      this.user = userData;
    },
    getUser() {
      return this.user;
    },
    clearUser() {
      this.user = null;
    },
  },
});

// import Vue from "vue";
//  import Vuex from "vuex";
// import Utils from "@/config/utils";

// Vue.use(Vuex);

// const user = Utils.getStore("user");

// export default new Vuex.Store({
//   state: {
//     loginUser: user,
//   },
//   mutations: {
//     setLoginUser(state, user) {
//       state.loginUser = user;
//       Utils.setStore("user", user);
//     },
//   },
//   actions: {},
//   getters: {
//     getLoginUserInfo(state) {
//       return state.loginUser;
//     },
//   },
// });
