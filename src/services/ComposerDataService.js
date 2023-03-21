import http from '../http-common';
class ComposerDataService {
  getAll() {
    return http.get("/composers");
  }
  get(id) {
    return http.get(`/composers/${id}`);
  }
  create(data) {
    return http.post("/composers", data);
  }
  update(id, data) {
    return http.put(`/composers/${id}`, data);
  }
  delete(id) {
    return http.delete(`/composers/${id}`);
  }
}
export default new ComposerDataService();