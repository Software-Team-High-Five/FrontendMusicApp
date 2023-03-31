import http from "../http-common";
class UserDataService {
  getAll() {
    return http.get("/users");
  }
  get(id) {
    return http.get(`/users/${id}`);
  }
  getAccompanists() {
    return http.get("/users/accompanists");
  }
  create(data) {
    return http.post("/users", data);
  }
  update(id, data) {
    return http.put(`/users/${id}`, data);
  }
  delete(id) {
    return http.delete(`/users/${id}`);
  }
  addInstrument(userId, instrumentId) {
    return http.post(
      `/userInstruments?userId=${userId}&instrumentId=${instrumentId}`
    );
  }
  removeInstrument(userId, instrumentId) {
    return http.delete(
      `/userInstruments?userId=${userId}&instrumentId=${instrumentId}`
    );
  }
  addRole(userId, roleId) {
    return http.post(`/userRole?userId=${userId}&roleId=${roleId}`);
  }
  removeRole(userId, roleId) {
    return http.delete(`/userRole?userId=${userId}&roleId=${roleId}`);
  }
}
export default new UserDataService();
