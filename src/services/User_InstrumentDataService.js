import http from '../http-common';
class User_InstrumentDataService {
  create(data) {
    return http.post("/userInstruments", data);
  }
  update(data) {
    return http.put("/userInstruments", data);
  }
  delete(uid, iid) {
    return http.delete(`/userInstruments/${uid}/${iid}`);
  }

}
export default new User_InstrumentDataService();