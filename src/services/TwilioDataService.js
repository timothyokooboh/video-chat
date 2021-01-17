import http from "./http-client";

class TwilioDataService {
    getAccessToken(data) {
        return http.get(`/token/?identity=${data}`)
    }
}

export default new TwilioDataService();