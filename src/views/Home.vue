<template>
    <div class="home">
        <app-notification />
        <form-signup class="signup"/> 
    </div>
</template>

<script>
import FormSignup from '@/components/auth/FormSignup.vue';
import AppNotification from '@/components/ui/AppNotification.vue';

export default {
    components: { 
        FormSignup, 
        AppNotification,
    }
}
</script>

<style lang="scss" scoped>
    .home {
        min-height: 100vh;
        background-image: url("/hero.png");
        background-size: cover;
        background-position: center;
        padding-top: 5rem;
    }

    .signup {
        animation: slideIn .4s ease-out forwards;
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translate(-100%);
        }
        to {
            opacity: 1;
            transform: translate(0);
        }
    }
</style>