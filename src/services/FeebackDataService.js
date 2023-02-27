import http from "../http-common";
class FeedbackDataService {
  getAll() {
    return http.get("/feedbacks");
  }
  get(id) {
    return http.get(`/feedbacks/${id}`);
  }
  create(data) {
    return http.post("/feedbacks", data);
  }
  update(id, data) {
    return http.put(`/feedbacks/${id}`, data);
  }
  delete(id) {
    return http.delete(`/feedbacks/${id}`);
  }
}
export default new FeedbackDataService();
