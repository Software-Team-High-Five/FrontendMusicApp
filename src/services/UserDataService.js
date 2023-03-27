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
}
export default new UserDataService();
