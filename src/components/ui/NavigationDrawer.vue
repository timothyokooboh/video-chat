<template>
    <div>
        <v-navigation-drawer
            app
            fixed
            v-model="drawer"
            :disable-resize-watcher="true"
            class="side-nav"
        >
            <app-rooms @click.native="drawer = false" :key="roomKey" />
               
        </v-navigation-drawer>
    </div>
</template>

<script>
import {EventBus} from "@/Event";
import AppRooms from "@/components/Rooms";
import {mapGetters} from "vuex";

export default {
    components: {
        AppRooms
    },
    data() {
        return {
            drawer: false
        }
    },
    computed: {
        ...mapGetters(["roomKey"])
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

<style lang="scss" scoped>
    .side-nav {
        @media all and (min-width: 56.25em) {
           display: none;
        }
    }
</style>