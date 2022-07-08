<template>
  <v-app>
    <v-app-bar v-if="!$route.meta.hideNavbar" app class="indigo" dark>
      <div class="d-flex align-center">
        <router-link style="text-decoration: none; color: inherit" to="/home">
          <h2>SONGPOP BALKANS</h2>
        </router-link>
      </div>

      <v-spacer></v-spacer>

      <v-btn @click="logout" text>
        <span class="mr-2">Log out</span>
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main class="indigo lighten-5">
      <transition name="slide" mode="out-in">
        <!-- <transition name="moveUp"> -->
        <!-- <transition name="fade"> -->
        <router-view />
      </transition>
    </v-main>
  </v-app>
</template>

<script>
import { Auth } from "@/services";

export default {
  name: "App",

  data: () => ({
    auth: Auth.state,
  }),

  methods: {
    goToHome() {
      this.$router.push("/home");
    },
    logout() {
      Auth.logout();
      this.$router.go();
    },
  },
};
</script>

<style>
/* slide */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.1s, transform 0.1s;
}
.slide-enter,
slide-leave-to {
  opacity: 0;
  transform: translateX(-30%);
}
/* moveUp */
.moveUp-enter-active {
  animation: fadeIn 1s ease-in;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
.moveUp-leave-active {
  animation: moveUp 0.3s ease-in;
}
@keyframes moveUp {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-400px);
  }
}
/* fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
