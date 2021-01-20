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
                    @click="$emit('add-room')"
                >
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </div>

            <div class="mics" v-if="joinedRoom">
                <v-tooltip>
                    <template v-slot:activator="{on}">
                        <div class="mx-3" @click="endCall" v-on="on">
                            <v-icon color="#F74D31" class="icon">mdi-phone-off</v-icon>
                        </div>
                    </template>
                     <div>End call</div>
                </v-tooltip>

                <v-tooltip v-if="isVideoOn" >
                    <template v-slot:activator="{on}">
                        <div class="mx-3" @click="offVideo" v-on="on">
                            <v-icon class="icon" color="#F74D31">mdi-video-off</v-icon>
                        </div>
                    </template>
                    <div>Turn off video</div>
                </v-tooltip>

                <v-tooltip v-if="!isVideoOn">
                    <template v-slot:activator="{on}">
                        <div class="mx-3" @click="onVideo" v-on="on">
                            <v-icon class="icon">mdi-video</v-icon>
                        </div>
                    </template>
                    <div>
                        Turn on video
                    </div>
                </v-tooltip>
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
            showLogs() {
                EventBus.$emit("show-logs");
            },
            endCall() {
                EventBus.$emit("end-call");
                this.joinedRoom = false;
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
