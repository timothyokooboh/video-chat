<template>
  <v-app id="app">
    <v-main>
     <transition name="slide" mode="out-in">
        <router-view />
     </transition>
    </v-main>
  </v-app>
</template>

<script>
export default {
 name: 'App',
  data() {
   return {
    username: "",
    authenticated: false
  }
 },
 
  created() {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated");
    const username = sessionStorage.getItem("username");
    const userId = sessionStorage.getItem("userId");
  
    if(!isAuthenticated || !username || !userId) return;

    this.$store.commit("isAuthenticated", {
      isAuth: isAuthenticated,
      username,
      userId
    });

    this.$router.push("/chat")
    .catch(() => {})
  }
}
</script>

<style lang="scss">

html {

  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  // variables
  --color-white: #FFFFFF;
  --color-black: #111111;
  --color-grey: #F8F8F8;
  --color-primary: #F74D31;
  --color-secondary: #34A0FB;
}

*,
*::before,
*::after {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

body {
  -ms-overflow-style: none;
  overflow-Y: scoll
}

body::-webkit-scrollbar {
  display: none;
}

.slide-enter-active {
  animation: slideIn .4s ease;
}

.slide-leave-active {
  animation: slideOut .4s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
  } 
  to {
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/*
  .box {
    border: 1px solid gray;
  }

  .username {
    margin: 12px auto 7px auto;
    color: wheat;
  }

  .Botton {
    color: #fff;
    background-color: #4d555f;
    border-color: #303840;
    padding: 8px;
    font-weight: bolder;
  }*/
</style>