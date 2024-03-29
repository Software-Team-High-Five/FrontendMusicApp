import apiClient from "@/http-common.js";
// import apiClient from "@/services/services.js";

export default {
  loginUser(user) {
    return apiClient.post("login", user);
  },
  authorizeUser(code) {
    return apiClient.post("authorize", code);
  },
  logoutUser(token) {
    return apiClient.post("logout", token);
  },
};
