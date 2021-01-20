<template>
    <div>
        <form>
            <div class="form-control">
                <label for="room-name" class="mb-5">Enter Room Name</label>
                <custom-input
                    id="room-name" 
                    v-model="roomName" 
                    bgColor="#F8F8F8"
                    height="3.5rem"
                    @keyup.enter.native="createNewRoom"
                />
            </div>
            
            <div class="form-control">
                <v-btn
                    width="100%"
                    class="btn"
                    @click="createNewRoom"
                    :loading="loading"
                >
                    Create room
                </v-btn>
            </div>
        </form>
    </div> 
</template>

<script>
import { EventBus } from '../Event';
import CustomInput from "@/components/ui/CustomInput";
import ChatRoomDataService from "@/services/ChatRoomDataService";
import {mapGetters} from "vuex";

export default {
    name: "AddRoom", 
    components: {
        CustomInput
    },
    data() {
        return {
            roomName: "",
            loading: false
        }
    },
    computed: {
        ...mapGetters(["userId"])
    },
    methods: {
        async createNewRoom() {
            if(!this.roomName) {
                EventBus.$emit("provide-room-name", {
                    message: "Please provide a room name"
                })
                return
            }

            this.loading = true;

            try {
                const room = await ChatRoomDataService.createNewRoom({
                    room: this.roomName,
                    userId: this.userId
                })

                console.log(room);

                EventBus.$emit('new-room', this.roomName);
                
                EventBus.$emit('room-added', {
                    message: "Room added successfully"
                });

                this.roomName = '';
                this.loading = false;

                EventBus.$emit("close-form")
            } 
            catch(err) {
                console.log(err.response)
                this.loading = false;

                EventBus.$emit("failed-request", {
                    message: err.response.data.message.startsWith("E11000") ? "This room name already exist" : err.response.data.message 
                })

                EventBus.$emit("close-form")
            }
          
        }
    }
}
</script>

<style lang="scss" scoped>
    form {
        width: 100%;

        .form-control {
            width: 100%;

            input {
                width: 100%;
            }

            label {
                display: block;
                font-size: 1.4rem;
                letter-spacing: 1.08px;
            }

            .btn {
                background-color: var(--color-secondary);
                color: var(--color-white);
                font-size: 1.4rem;
                border-radius: 10rem;
                height: 3.5rem;
                margin-top: 2rem;

                @media all and (max-width: 18.4em) {
                    font-size: 1rem;
                }
            }
        }
    }
</style>