import http from "./http-client";

class ChatRoomDataService {
    createNewRoom(data) {
        return http.post("/rooms", data);
    }

    getRooms() {
        return http.get("/rooms");
    }
    
    deleteRoom(id, userId) {
        return http.delete(`/rooms/${id}/${userId}`);
    }
}

export default new ChatRoomDataService();