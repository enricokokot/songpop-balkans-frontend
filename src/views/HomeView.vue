<template>
  <v-container fill-height>
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
      this.$router.push("/store");
    },
  },
  async mounted() {
    this.user = store.currentUser;
    store.achievements = await this.fetchAllAchievements();
  },
  computed: {
    //
  },
};
</script>
