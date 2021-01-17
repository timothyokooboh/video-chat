<template>
    <div class="not-found">
        <div>
            <h1>404</h1>
            <div>Page not found</div>

            <v-btn 
                to="/chat" 
                class="mt-5"
                outlined
                color="#F74D31"
            >
                Back to chat room
            </v-btn>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .not-found {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;

        a {
            text-decoration: none;
        }
    }
</style>