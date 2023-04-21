import http from '../http-common';
class AvailabilityDataService {
  getAll() {
    return http.get("/availabilities");
  }
  getForEvent(uid, eid) {
    let path = `/availabilities/event/${eid}`;
    if (uid) path += `?userId=${uid}`;
    return http.get(path);
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