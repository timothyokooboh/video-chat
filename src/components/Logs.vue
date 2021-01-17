<template>
    <div class="logs" v-if="showLogs">
        <div class="close-icon" @click="showLogs = false">
            <v-icon>mdi-close</v-icon>
        </div>
        <h3>Event logs</h3>
        <div class="mt-5" v-if="!logs.length">No logs yet</div>
        <div class="log my-3"  v-for="log in logs" v-bind:key="log.id">
            {{log.message}}.
        </div>
    </div>
</template>

<script>
import { EventBus } from '../Event'

export default {
    name: "Logs",
    data() {
        return {
            logs: [],
            logCount: 0,
            showLogs: false
        }
    },
    watch: {
        logCount: {
            handler(newValue) {
                EventBus.$emit("logs-changed", newValue)
            }
        }
    },
    created() {
        EventBus.$on('new_log', (message) => {
            this.logs.push( {id: this.logCount, message: message} );

            this.logCount += 1; 
        })

        EventBus.$on('show-logs', () => {
            this.showLogs = true;
        })

        EventBus.$on('end-call', () => {
            this.logs = [];
            this.logCount = 0;
        })
    },
}
</script>

<style lang="scss" scoped>
    .logs {
        position: absolute;
        top: 50%;
        right: 2rem;
        padding: 2rem 3rem;
        max-width: 25rem;
        width: 90%;
        z-index: 6000;
        background-color: var(--color-grey);
        border-top-left-radius: 2rem;
        border-bottom-right-radius: 2rem;
        animation: slideIn .4s ease-out forwards;
    }

   .log {
        color: var(--color-black)
    }

    .close-icon {
        position: absolute;
        right: 10px;
        top: 10px;
        cursor: pointer;
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(101%);
        }
        to {
            opacity: 1;
            transform: translateX(0)
        }
    }
</style>