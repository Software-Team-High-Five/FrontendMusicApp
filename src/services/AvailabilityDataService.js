import http from '../http-common';
class AvailabilityDataService {
  getAll() {
    return http.get("/availabilities");
  }
  get(id) {
    return http.get(`/availabilities/${id}`);
  }
  create(data) {
    return http.post("/availabilities", data);
  }
  update(id, data) {
    return http.put(`/availabilities/${id}`, data);
  }
}
export default new AvailabilityDataService();