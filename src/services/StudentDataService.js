import http from '../http-common';
class StudentDataService {
  getAll() {
    return http.get("/students");
  }
  get(id) {
    return http.get(`/students/${id}`);
  }
  create(data) {
    return http.post("/students", data);
  }
  update(id, data) {
    return http.put(`/students/${id}`, data);
  }
  delete(id) {
    return http.delete(`/students/${id}`);
  }
  findByTitle(title) {
    return http.get(`/students?title=${title}`);
  }
  instructorStudents(iid){
    return http.get(`students/instructor/${iid}`);
  }
  addInstrument(studentId, instrumentId) {
    return http.post(`/studentInstruments?studentId=${studentId}&instrumentId=${instrumentId}`);
  }
  removeInstrument(studentId, instrumentId) {
    return http.delete(`/studentInstruments?studentId=${studentId}&instrumentId=${instrumentId}`);
  }
}
export default new StudentDataService();