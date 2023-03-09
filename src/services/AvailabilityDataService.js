import http from '../http-common';
class AvailabilityDataService {
  getAll() {
    return http.get("/availabilities");
  }
  getForEvent(uid, eid) {
    return http.get(`/availabilities/event/${uid}/${eid}`);
  }
  get(id) {
    return http.get(`/availabilities/${id}`);
  }
  getTeacherAvailability() {
    return http.get(`/availabilities/studentSignup`);
  }
  create(data) {
    return http.post("/availabilities", data);
  }
  update(id, data) {
    return http.put(`/availabilities/${id}`, data);
  }
}
export default new AvailabilityDataService();