// import axios from "axios";

// export default axios.create({
//   baseURL: process.env.NODE_ENV === 'development' ? "http://localhost:3025/performance-t5" : "/performance-t5",
//   headers: { "Content-Type": "application/json" }
// });
import axios from "axios";
// import Utils from "./config/utils.js";
import AuthServices from "./services/authServices.js";
import Router from "./router.js";
import { useUserStore } from "@/stores/userStore";
import { pinia } from "@/main.js";
// import { mapStores } from "pinia";

// mapStores(useUserStore);

var baseurl = "";
if (process.env.NODE_ENV === "development") {
  baseurl = "http://localhost:3025/performance-t5/";
} else {
  baseurl = "/performance-t5/";
}

const apiClient = axios.create({
  baseURL: baseurl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Access-Control-Allow-Origin": "*",
    crossDomain: true,
  },
  transformRequest: (data, headers) => {
    const userStore = useUserStore(pinia);
    // let user = Utils.getStore("user");
    // let user = useUserStore.getUser();
    // let user = useUserStore().user;
    let user = userStore.user;

    if (user != null) {
      let token = user.token;
      let authHeader = "";
      if (token != null && token != "") authHeader = "Bearer " + token;
      headers.common["Authorization"] = authHeader;
    }
    return JSON.stringify(data);
  },
  transformResponse: function (data) {
    const userStore = useUserStore(pinia);
    data = JSON.parse(data);
    // if (!data.success && data.code == "expired-session") {
    //   localStorage.deleteItem("user");
    // }
    if (data.message !== undefined && data.message.includes("Unauthorized")) {
      AuthServices.logoutUser(userStore.user)
        .then((response) => {
          console.log(response);
          // useUserStore.clearUser();
          userStore.clearUser();
          Router.push({ name: "login" });
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
    // console.log(Utils.getStore("user"))
    return data;
  },
});

export default apiClient;
