<template>
    <div class="chat-room">
        <the-appbar />

        <navigation-drawer />

        <app-notification />

        <app-logs class="app-logs"/>

        <div class="addroom-wrapper" v-if="addRoom" @click.self="addRoom = false">
            <div>
                <v-icon 
                    class="close-icon"
                    @click="addRoom = false"
                >
                    mdi-close
                </v-icon>
                <add-room/>
            </div>
        </div>

        <div class="main-layout">
            <div class="room-list">
                <app-rooms :key="roomKey"/>
            </div>

            <div class="app-video">
                <app-video :key="videoKey"/>
            </div>
    
        </div>

        <bottom-appbar />
    </div>
</template>

<script>
import AppRooms from '@/components/Rooms';
import AppVideo from '@/components/Video';
import AppLogs from '@/components/Logs';
import AddRoom from '@/components/AddRoom';
import TheAppbar from "@/components/ui/TheAppbar";
import BottomAppbar from '../components/ui/BottomAppbar';
import AppNotification from "@/components/ui/AppNotification";
import {EventBus} from "@/Event";
import NavigationDrawer from '../components/ui/NavigationDrawer.vue';
import {mapGetters} from "vuex";

export default {
    data() {
        return {
            addRoom: false,
            videoKey: 0
        }
    },
    components: {
        AppRooms,
        AppVideo,
        AppLogs,
        AddRoom,
        TheAppbar,
        BottomAppbar,
        AppNotification,
        NavigationDrawer 
    },
    computed: {
        ...mapGetters(["roomKey"])
    },
    created() {
        EventBus.$on("add-room", () => {
            this.addRoom = true;
        })

        EventBus.$on("close-form", () => {
            this.addRoom = false;
        })

        EventBus.$on("new-room", () => {
            this.addRoom = false;
        })

        EventBus.$on("end-call", () => {
            this.videoKey++;
        })

    }
    
}
</script>

<style lang="scss" scoped>
    .chat-room {
        background-color: var(--color-black);
        min-height: 100vh;
    }

    .addroom-wrapper {
        min-height: 100vh;
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color:rgb(247, 77, 49, .7); //rgba(var(--color-primary, .5));
        z-index: 10000;

        @supports(backdrop-filter: blur(5px)) {
            background-color:rgb(247, 77, 49, .7); 
            backdrop-filter: blur(5px);
        }

        & > * {
            background-color: var(--color-white);
            max-width: 50rem;
            width: 90%;
            margin: auto;
            padding: 3rem;
            border-radius: 1rem;
            position: relative;
        }

        .close-icon {
            position: absolute;
            top: 1rem;
            right: 5px;
        }
    }

    .main-layout {
        display: grid;
        grid-template-columns: 15rem 1fr;
        column-gap: 1rem;

        @media all and (max-width: 56.25em) {
            grid-template-columns: 1fr;
        }
    }

    .app-video {
        padding: 0 3em;
    }

    .room-list {
        @media all and (max-width: 56.25em) {
            display: none;
        }
    }

   
</style>