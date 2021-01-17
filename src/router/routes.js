
import Vue from "vue";
import VueRouter from 'vue-router'
import store from "../store";

Vue.use(VueRouter);

const routes = [
    {
        name: "Home",
        path: "/",
        component: () => import("../views/Home")
    },
    {
        name: "Chat",
        path: "/chat",
        component: () => import("../views/Chat.vue"),
        beforeEnter(to, from, next) {
            if(store.getters.auth) {
                next()
            } else {
                next("/")
            }
        }
    },
    {
        name: "NotFound",
        path: "*",
        component: () => import("../components/NotFound.vue")
    }
]


const router = new VueRouter({
    routes
})

export default router;
