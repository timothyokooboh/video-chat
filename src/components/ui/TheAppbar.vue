<template>
    <v-app-bar
        app
        fixed
        color="#FFF"
    >
        <v-app-bar-nav-icon class="nav-icon" @click="showNavigationDrawer" />
        <v-toolbar-title>CHAT ROOM</v-toolbar-title>

        <v-spacer></v-spacer>

        <div class="d-flex">
            <div>
                <v-icon>mdi-account-circle</v-icon>
            </div>

            <div>
                <v-menu offset-y>
                    <template v-slot:activator="{on}">
                        <v-icon v-on="on">mdi-menu-down</v-icon>
                    </template>
                    <v-card class="pa-5">
                        <div>Hi, {{username}}</div>
                        <v-btn
                            outlined
                            color="#F74D31"
                            class="mt-5 body-2"
                            @click="signout"
                        >
                            Sign out
                        </v-btn>
                    </v-card>
                </v-menu>
            </div>
        </div>
    </v-app-bar>
</template>

<script>
import {mapGetters, mapMutations} from"vuex";
import { EventBus } from '@/Event';


export default {
    computed: {
        ...mapGetters(["username"])
    },
    methods: {
        ...mapMutations(["signout"]),
        showNavigationDrawer() {
            EventBus.$emit("show-navigation-drawer")
        }
    }
}
</script>

<style lang="scss" scoped>
    .nav-icon {
        display: none;

        @media all and (max-width: 56.25em) {
            display: block;
        }
    }
</style>