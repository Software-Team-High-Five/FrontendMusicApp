import http from '../http-common';
class EventDataService {
  getAll() {
    return http.get("/events");
  }
  get(id, iid = null) {
    var path = `/events/${id}`;
    if(iid) {
      path += `?iid=${iid}`
    }
    return http.get(path);
  }
  getInstrumental() {
    return http.get('/events/instrumental');
  }
  getVocal() {
    return http.get('/events/vocal');
  }
  create(data) {
    return http.post("/events", data);
  }
  update(id, data) {
    return http.put(`/events/${id}`, data);
  }
  delete(id) {
    return http.delete(`/events/${id}`);
  }
  getActive() {
    return http.get("/events/active");
  }
}
export default new EventDataService();