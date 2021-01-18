<template>
    <v-app-bar
        app
        fixed
        bottom
        color="#FFF"
    >
        <div class="actions-tab">
            <div class="add-room">
                <v-btn 
                    fab
                    color="#34A0FB"
                    class="white--text px-5"
                    small
                    @click="addRoom"
                >
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </div>

            <div class="mics" v-if="joinedRoom">
                <div class="mx-3" @click="endCall">
                    <v-icon color="#F74D31" class="icon">mdi-phone-off</v-icon>
                </div>
                <div class="mx-3" @click="offVideo" v-if="isVideoOn">
                    <v-icon class="icon" color="#F74D31">mdi-video-off</v-icon>
                </div>
                <div class="mx-3" @click="onVideo" v-if="!isVideoOn">
                    <v-icon class="icon">mdi-video</v-icon>
                </div>
            </div>

            <div @click="showLogs" class="icon logs">
                <div class="logs-count">{{logsCount}}</div>
                <v-icon>mdi-message</v-icon>
            </div>
        </div>
    </v-app-bar>
</template>

<script>
    import {EventBus} from "@/Event";

    export default {
        data() {
            return {
                logsCount: 0,
                isVideoOn: true,
                joinedRoom: false
            }
        },
        methods: {
            addRoom() {
                EventBus.$emit("add-room");
            },
            endCall() {
                EventBus.$emit("end-call");
                this.joinedRoom = false;
            },
            showLogs() {
                EventBus.$emit("show-logs")
            },
            offVideo() {
                this.isVideoOn = !this.isVideoOn;
                EventBus.$emit("off-video");
            },
            onVideo() {
                this.isVideoOn = !this.isVideoOn;
                EventBus.$emit("on-video");
            }
        },
        created() {
            EventBus.$on("logs-changed", data => {
                this.logsCount = data
            });

            EventBus.$on("joined-room", () => {
                this.joinedRoom = true;
            })
        },
        beforeDestroy() {
            // off events to avoid leaks
            EventBus.$off("logs-changed");
            EventBus.$off("joined-room");
        }
    }
</script>

<style lang="scss" scoped>
    .actions-tab {
        display: flex;
        align-items: center;
        width: 100%;
    }

    .mics {
        display: flex;
        justify-content: center;
        width: 100%;
        margin-right: auto;
    }

    .icon {
        cursor: pointer;
    }

    .add-room {
        margin-right: auto;
    }

    .logs {
        justify-self: flex-end;
    }

    .logs-count {
        margin-bottom: -11px;
        margin-left: 10px;
        background-color: var(--color-primary);
        color: var(--color-white);
        border-radius:  50%;
        padding: .1rem .3rem;
    }
</style>
