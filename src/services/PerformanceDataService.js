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
    console.log('pid: ', id, data);
    return http.put(`/performances/${id}`, data);
  }
  delete(id) {
    return http.delete(`/performances/${id}`);
  }
  getAllForStudent(id) {
    return http.get(`/performances/student/${id}`);
  }

  getAllForInstructor(id) {
    return http.get(`/performances/instructor/${id}`);
  }

  addSong(id, songId) {
    return http.post(`/performanceSongs?performanceId=${id}&songId=${songId}`);
  }
  removeSong(id, songId) {
    return http.delete(`/performanceSongs?performanceId=${id}&songId=${songId}`);
  }

  getTakenTimes(eventId) {
    return http.get(`/performances/takenTimes/${eventId}`);
  }

  editPerformance(studentId, eventId) {
    return http.get(`/performances/editPerformance/${eventId}/${studentId}`);
  }
}
export default new PerformanceDataService();