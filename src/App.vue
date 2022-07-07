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
      <router-view />
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
