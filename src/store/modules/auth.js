import router from "../../router/routes";
import {EventBus} from "../../Event";

const state = {
    isAuth: false,
    username: "",
    userId: "",
}

const getters = {
    auth(state) {
        return state.isAuth
    },
    username(state) {
        return state.username
    },
    userId(state) {
        return state.userId
    }
}

const mutations = {
    isAuthenticated(state, payload) {
        state.username = payload.username;
        state.isAuth = payload.auth;
        state.userId = payload.userId
    },

    signout(state) {
        state.isAuth = false;
        state.username = "";

        EventBus.$emit('end-call')

        sessionStorage.removeItem("isAuthenticated");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("userId");
        
        router.replace("/")
    }
}

export default {
    state,
    getters,
    mutations
}