<template>
    <div>
        <v-navigation-drawer
            app
            v-model="drawer"
            :disable-resize-watcher='true'
        >
            <app-rooms @click.native="drawer = false"/>
        </v-navigation-drawer>
    </div>
</template>

<script>
import {EventBus} from "@/Event";
import AppRooms from "@/components/Rooms";

export default {
    components: {
        AppRooms
    },
    data() {
        return {
            drawer: false
        }
    },
    created() {
        EventBus.$on("show-navigation-drawer", () => {
            this.drawer = !this.drawer;
        })
    },
    beforeDestroy() {
        EventBus.$off("show-navigation-drawer");
    }
}
</script>