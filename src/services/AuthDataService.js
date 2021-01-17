import http from "./http-client";

class AuthDataService {
    addUser(data) {
        return http.post("/user", data)
    }
}

export default new AuthDataService();