import Vue from "vue";
import Vuex from "vuex";

import auth from "./modules/auth";
import room from "./modules/room";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {
        auth,
        room
    }
})

