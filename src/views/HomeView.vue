<template>
  <v-container fill-height>
    <v-snackbar v-model="snackbar" :multi-line="true">
      Sorry, additional playlists and songs are still being made!
      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-col>
      <v-row class="align-center justify-center">
        <v-btn
          x-large
          color="primary"
          class="ma-2"
          @click="goToPlay()"
          style="width: 300px"
          >PLAY</v-btn
        >
      </v-row>
      <v-row class="align-center justify-center">
        <v-btn
          x-large
          color="primary"
          class="ma-2"
          @click="goToAchievements()"
          style="width: 300px"
          >ACHIEVEMENTS</v-btn
        >
      </v-row>
      <v-row class="align-center justify-center">
        <v-btn
          x-large
          color="primary"
          class="ma-2"
          @click="goToStore()"
          style="width: 300px"
          >STORE</v-btn
        >
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
import store from "@/store";
import { Auth, Users } from "@/services";

export default {
  name: "HomeView",
  data: () => ({
    userId: Auth.state.user.userId,
    auth: Auth.authenticated,
    snackbar: false,
  }),
  methods: {
    async fetchAllAchievements() {
      const allAchievements = await Users.getAllAchievements(this.userId);
      return allAchievements;
    },
    goToPlay() {
      this.$router.push("/duel");
    },
    goToAchievements() {
      this.$router.push("/achievements");
    },
    goToStore() {
      this.snackbar = !this.snackbar;
      // this.$router.push("/store");
    },
  },
  async mounted() {
    store.achievements = await this.fetchAllAchievements();
  },
  computed: {
    //
  },
};
</script>
