<template>
    <div 
        class="notification" 
        :class="{successful, error}"
        v-if="show"
    >
       <div>{{message}}</div>
    </div>
</template>

<script>
import {EventBus} from "../../Event";

export default {
    props: {
        status: {
            type: String,
            default: "successful",
            validator: function(value) {
                return ["successful", "error"].indexOf(value) > -1;
            }
        }
    },
    data() {
        return {
            show: false,
            successful: false,
            error: false,
            message: ""
        }
    },
    computed: {
        notificationStyle() {
            return {
                successful: "successful",
                error: "error"
            }
        }
    },
    methods: {
        hideNotification() {
            setTimeout(() => {
                this.show = false
                this.message = "";
                this.error = false;
                this.successful = false;
            }, 2000)
        }
    },
    mounted() {
         EventBus.$on("signup-failed", data => {
            this.show = true;
            this.message = data.message;
            this.error = true

            this.hideNotification()
         });

        EventBus.$on("enter-username", data => {
            this.show = true;
            this.message = data.message;
            this.error = true

            this.hideNotification()
        })

        EventBus.$on("provide-room-name", data => {
            this.show = true;
            this.message = data.message;
            this.error= true;

            this.hideNotification()
        })

        EventBus.$on("room-added", data => {
            this.show = true;
            this.successful = true
            this.message = data.message;

            this.hideNotification()
        })

        EventBus.$on('end-call', () => {
            this.show = true;
            this.message = "You left the call";
            this.successful = true;

            this.hideNotification()
        })

        EventBus.$on('connection-failed', () => {
            this.show = true;
            this.message = "Failed to connect to the room. Please try again";
            this.error = true;

            this.hideNotification()
        })

        EventBus.$on('failed-request', (data) => {
            this.show = true;
            this.message = data.message;
            this.error = true;

            this.hideNotification()
        });

        EventBus.$on('failed-to-delete-room', (data) => {
            this.show = true;
            this.message = data.message;
            this.error = true;

            this.hideNotification()
        });

        EventBus.$on('room-deleted', (data) => {
            this.show = true;
            this.message = data.message;
            this.successful = true;

            this.hideNotification()
        })
    }
}
</script>

<style lang="scss" scoped>
    .notification {
        position: fixed;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        z-index: 20000;
        display: table; // to assume the width of its content
        padding: 1rem 2rem;
        border-radius: 1rem;
        font-size: 1.6rem;
    }

    .error {
        background: var(--color-primary);
        color: var(--color-white);
    }

    .successful {
        background: var(--color-secondary);
        color: var(--color-white);
    }
</style>