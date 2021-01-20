<template>
   <div>
       <div class="room-title py-5">
           <span v-if="loading"> Loading... {{roomName}}</span>
           <span v-else-if="!loading && roomName"> Connected to {{roomName}}</span>
           <div v-else>
               <div class="large-screen">Select a room to get started</div>
               <div class="small-screen" @click="showNavigationDrawer">
                   <span> Select a room to join chat</span> <br>
                   <v-icon color="#FFF">mdi-arrow-left</v-icon>
               </div>
            </div>
       </div>

       <div class="tracks">
           <div class="track">
                <div id="remoteTrack"></div>
            </div>
            <div class="track">
                <div id="localTrack"></div>
            </div>
       </div>
   </div>
</template>

<script>
import Twilio, { createLocalVideoTrack } from 'twilio-video'
import { EventBus } from '../Event'
import {mapGetters} from "vuex";
import TwilioDataService from "@/services/TwilioDataService.js";

export default {
    name: "Video",
    data() {
        return {
            loading: false,
            isLocalTrack: false,
            localTrack: "",
            remoteTrack: '',
            activeRoom: '',
            previewTracks: '',
            identity: '',
            roomName: null
        }
    },

    computed: {
        ...mapGetters(["username"]),
        windowWidth() {
            let windowWidth = window.innerWidth;
            return (35 * windowWidth)/100
        }
    },
    methods: {
        showNavigationDrawer() {
            EventBus.$emit("show-navigation-drawer")
        },
        // Generate access token
        async getAccessToken() {
            return await TwilioDataService.getAccessToken(this.username);
        },
        // Trigger log events 
        dispatchLog(message) {
            EventBus.$emit('new_log', message);
        },

        // Attach the Tracks to the DOM.
        attachTracks(tracks, container) {
            tracks.forEach(function(track) {
                container.appendChild(track.attach());
            });
        },

        // Attach the Participant's Tracks to the DOM.
        attachParticipantTracks(participant, container) {
            let tracks = Array.from(participant.tracks.values());
            this.attachTracks(tracks, container);
        },

        // Detach the Tracks from the DOM.
        detachTracks(tracks) {
            console.log(tracks)
            tracks.forEach( (track) => {
                track.detach().forEach((detachedElement) => {
                    detachedElement.remove();
                });
            });
        },

        // Detach the Participant's Tracks from the DOM.
        detachParticipantTracks(participant) {
            let tracks = Array.from(participant.tracks.values());
            this.detachTracks(tracks);
        },

        // Leave Room.
        leaveRoomIfJoined() {
            if (this.activeRoom) {
                this.activeRoom.disconnect();

                // turn of camera lights
                this.localTrack.mediaStreamTrack.stop();

                // Remove local track from the DOM
                document.querySelector("#localTrack").innerHTML = "";

                // Reset the value of isLocalTrack
                this.isLocalTrack = false;

                this.loading = false;
                this.roomName = null;
            }

        },

        async connectToTwilio(token, options, roomName) {
            const room = await Twilio.connect(token, options);
            EventBus.$emit("joined-room");
            const vm = this;

            console.log('Successfully joined a Room: ', room);
            vm.dispatchLog('Successfully joined a Room: '+ roomName);

            // set active toom
            vm.activeRoom = room;
            vm.roomName = roomName;
            vm.loading = false;

            // Attach the Tracks of all the remote Participants.
            /*room.participants.forEach(function(participant) {
                console.log(participant)
                let previewContainer = document.getElementById('remoteTrack');
                vm.attachParticipantTracks(participant, previewContainer);
            });*/

            // When a Participant joins the Room, log the event.
            room.on('participantConnected', function(participant) {
                vm.dispatchLog("Joining: '" + participant.identity + "'");
            });

            // When a Participant adds a Track, attach it to the DOM.
            room.on('trackSubscribed', function(track, participant) {
                vm.dispatchLog(participant.identity + " added track: " + track.kind);
                let previewContainer = document.getElementById('remoteTrack');
                vm.attachTracks([track], previewContainer);
            });

            // When a Participant removes a Track, detach it from the DOM.
            room.on('trackUnsubscribed', function(track, participant) {
                vm.dispatchLog(participant.identity + " removed track: " + track.kind);
                vm.detachTracks([track]);
            });

            // When a Participant leaves the Room, detach its Tracks.
            room.on('participantDisconnected', function(participant) {
                vm.dispatchLog("Participant '" + participant.identity + "' left the room");
                vm.detachParticipantTracks(participant);
            });
        },

        // Create a new chat
        async createChat(room_name) {
            this.loading = true;
            const vm = this;

            try {
                const data = await this.getAccessToken();
                vm.roomName = null;
                console.log(data)
                const token = data.data.token;

                let connectOptions = {
                    name: room_name,
                    audio: true,
                    video: {
                        width: {
                            max: this.windowWidth
                        }
                    }
                };
                // before a user enters a new room,
                // disconnect the user from other rooms they have already joined

                this.leaveRoomIfJoined();
            
                // remove any remote track when joining a new room
                document.getElementById('remoteTrack').innerHTML = "";

                //const room = await this.connectToTwilio(token, connectOptions, room_name);
                await this.connectToTwilio(token, connectOptions, room_name);
        
                if(!vm.isLocalTrack) {
                    createLocalVideoTrack().then(track => {
                        console.log(track)
                        this.localTrack = track;
                        let localMediaContainer = document.getElementById('localTrack');

                        localMediaContainer.appendChild(track.attach());
                        vm.isLocalTrack = true;
                    });
                }

            } 
            catch(err) {
                console.log(err)
                this.loading = false;
                EventBus.$emit("connection-failed");
            }
        },
   },

   created() {
        EventBus.$on('join-room', (room_name) => {
            this.createChat(room_name);
        });

        EventBus.$on('end-call', () => {
            this.leaveRoomIfJoined();
        });

        EventBus.$on('off-video', async () => {
            document.querySelector("#localTrack").innerHTML = "";
        });

        EventBus.$on('on-video', async () => {
            const localMediaContainer = document.querySelector("#localTrack");
            localMediaContainer.appendChild(this.localTrack.attach());
        });

        EventBus.$on("sign-out", async() => {
            this.leaveRoomIfJoined();
        })

        // When a user is about to transition away from this page, 
        // disconnect from the room, if joined.
        window.addEventListener('beforeunload', this.leaveRoomIfJoined);

    },
    beforeDestroy() {
        EventBus.$off('join-room');
        EventBus.$off('end-call');
        EventBus.$off('off-video');
        EventBus.$off('on-video');
        EventBus.$off("sign-out");
    }

}
</script>

<style lang="scss" scoped>

    .tracks {
        display: grid;
        grid-template-columns: 60% 40%;
        column-gap: 1rem;
        align-items: start;
    }

    .track {
        width: 100%;
        overflow: hidden;
    }

    #localTrack,
    #remoteTrack {
        border-radius: 1rem;
        width: 100%;
    }

    #localTrack {
        height: 200px;
    }

    .room-title {
       color: var(--color-white);
    }

    .large-screen {
        @media all and (max-width: 56.25em) {
            display: none;
        }
    }

    .small-screen {
        display: none;

        @media all and (max-width: 56.25em) {
            display: block;
            cursor: pointer;
        }
    }
</style>