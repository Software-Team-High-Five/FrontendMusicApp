import http from '../http-common';
class PerformanceDataService {
  getAll() {
    return http.get("/performances");
  }
  get(id) {
    return http.get(`/performances/${id}`);
  }
  create(data) {
    return http.post("/performances", data);
  }
  update(id, data) {
    return http.put(`/performances/${id}`, data);
  }
  delete(id) {
    return http.delete(`/performances/${id}`);
  }
  getAllForStudent(sid) {
    return http.get(`/performances/student/${sid}`);
  }
}
export default new PerformanceDataService();