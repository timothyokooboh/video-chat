<template>
    <div>
        <form>
            <h1 class="form-control mb-5 form-title">Enter your username to begin a chat</h1>
            <div class="form-control">
                <label for="username" class="mb-5 username">Username</label>
                <custom-input
                    id="username" 
                    v-model="user" 
                    bgColor="#F8F8F8"
                    height="3.5rem"
                />
            </div>

            <div class="form-control">
                <v-btn 
                    @click="submit"
                    color="#F74D31"
                    class="white--text btn"
                    width="100%"
                    :loading="loading"
                 >
                    submit
                </v-btn>
            </div>
        </form>
    </div>
</template>

<script>
import CustomInput from "@/components/ui/CustomInput";
import {EventBus} from "@/Event";
import AuthDataService from "@/services/AuthDataService";
import {mapGetters} from "vuex";

export default {
    components: {
        CustomInput,
    },
    data() {
        return {
            user: "",
            loading: false
        }
    },
    computed: {
        ...mapGetters(["username", "userId", "isAuth"])
    },
    methods: {
        async submit() {
           if(!this.user) {   
                EventBus.$emit("enter-username", {
                    message: "Please enter a username"
                })
                return;
            }

            this.loading = true;

            try {

                const user = await AuthDataService.addUser({
                    username: this.user
                })

                console.log(user)

                const userId = user.data.data.user._id;

                this.$store.commit("isAuthenticated", {
                    username: this.user,
                    isAuth: true,
                    userId: userId
                });

                this.storeDetails(userId);

                this.$router.push("/chat")
                .catch(() => {})

                this.loading = false;

            }
            catch(err) {
                console.log(err.response);
                this.loading = false;
                EventBus.$emit("signup-failed", {
                    message: err.response.data.message
                });
            }
        },
        storeDetails(userId) {
            sessionStorage.setItem("isAuthenticated", true);
            sessionStorage.setItem("username", this.user);
            sessionStorage.setItem("userId", userId);
        }
    }
}
</script>

<style lang="scss" scoped>
    form {
        background-color: var(--color-white);
        max-width: 50rem;
        width: 90%;
        margin: 0 auto;
        padding: 2rem 2rem 3rem;
        border-radius: 2.2rem;

        h1 {
            font-weight: 400;

            @media all and (max-width: 27.25em) {
                font-size: 1.6rem;
                font-weight: 500;
            }

            @media all and (max-width: 22.81em) {
                font-size: 1.5rem;
                font-weight: 500;
            }
        }

        .form-control {
            width: 90%;
            margin: 0 auto;

            label {
                display: block;
                letter-spacing: 1.08px;
            }

            .btn {
                margin: 2rem 0 0;
                border-radius: 10rem;
                height: 3.5rem;
                font-size: 1.4rem;
            }
        }
    }

    .form-title,
    .username {
        animation: fadeIn .8s ease .8s forwards;
        animation-fill-mode: backwards;
    }

    .btn {
        animation: moveUp .8s ease 1s forwards;
        animation-fill-mode: backwards;
    }

    @keyframes fadeIn {
        from {
            opacity: 0
        }
        to {
            opacity: 1;
        }
    }

    @keyframes moveUp {
        from {
            opacity: 0;
            transform: translateY(101%);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>