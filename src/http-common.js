import axios from "axios";
import AuthServices from "./services/authServices.js";
import Router from "./router.js";
import { useUserStore } from "@/stores/userStore";
import { pinia } from "@/main.js";

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
    let user = userStore.user;

    if (user != null) {
      let token = user.token;
      let authHeader = "";
      if (token != null && token != "") authHeader = "Bearer " + token;
      headers["Authorization"] = authHeader;
    }
    return JSON.stringify(data);
  },
  transformResponse: function (data) {
    const userStore = useUserStore(pinia);
    data = JSON.parse(data);
    if (data.message !== undefined && data.message.includes("Unauthorized")) {
      AuthServices.logoutUser(userStore.user)
        .then((response) => {
          console.log(response);
          userStore.clearUser();
          Router.push({ name: "login" });
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
    return data;
  },
});

export default apiClient;
