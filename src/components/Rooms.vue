<template>
  <div class="rooms">
    <div v-if="!rooms.length" class="white--text">
      <div class="py-3">No rooms yet</div>
      <h3>Click the plus icon to create a room</h3>
    </div>

    <div v-if="rooms.length">
      <h3 class="white--text">Rooms</h3>

      <div 
        class="room my-5" 
        v-for="room in rooms" 
        v-bind:key="room._id" 
      >
        <div class="mr-3" @click="joinRoom(room.room)">
          <v-icon color="#FFFFFF" left>
            mdi-account-group
          </v-icon>
          <span> {{room.room}} </span>
        </div>

        <div>
          <v-icon 
            color="#FFF" 
            small
            v-if="userId == room.userId "
            @click = "deleteRoom(room._id, room.userId)"
          >
            mdi-delete
          </v-icon>
        </div>

      </div>
    </div> 
  </div>
</template>

<script>
import { EventBus } from '../Event';
import ChatRoomDataService from "@/services/ChatRoomDataService";
import {mapGetters} from "vuex";

export default {
  name: "Rooms",
  data() {
    return {
      rooms: []
    }
  },
  computed: {
    ...mapGetters(["userId"]),
    roomCount() {
      return this.rooms.length
    }
  },
  methods: {
    joinRoom(room) {
      EventBus.$emit('join-room', room);
    },
    async getRooms() {
      try {
        const rooms = await ChatRoomDataService.getRooms();
        console.log(rooms.data.data.rooms);
        this.rooms = rooms.data.data.rooms;
      } 
      catch(err) {
        console.log(err)
      }
    },
    async deleteRoom(id, userId) {
      console.log(userId)
      try {
        const room = await ChatRoomDataService.deleteRoom(id, userId)
        console.log(room)

        EventBus.$emit("room-deleted", {
          message: "Room deleted successfully"
        })

        await this.getRooms();
        this.$store.commit("incrementRoomKey");
      }
      catch(err) {
        console.log(err.response)
        EventBus.$emit("failed-to-delete-room", {
          message: err.response.data.message
        })
      }
    }
  },
  created() {
    this.getRooms();

    EventBus.$on('new-room', async () => {
      await this.getRooms();
    });

  },
  beforeDestroy() {
    EventBus.$off('new-room');
  }

}
</script>

<style lang="scss" scoped>
  .rooms {
    background-color: var(--color-primary);
    padding: 2rem 1rem 5rem;
    min-height: 100vh;
    position: sticky;
    top: 0;
  }

  .room {
    color: var(--color-white);
    display: flex;
    height: 100%;
    align-items: baseline;
    cursor: pointer;
  }
</style>