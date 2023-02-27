import http from '../http-common';
class InstrumentsDataService {
  getAll() {
    return http.get("/instruments");
  }
  get(id) {
    return http.get(`/instruments/${id}`);
  }
  create(data) {
    return http.post("/instruments", data);
  }
  update(id, data) {
    return http.put(`/instruments/${id}`, data);
  }
  delete(id) {
    return http.delete(`/instruments/${id}`);
  }
}
export default new InstrumentsDataService();