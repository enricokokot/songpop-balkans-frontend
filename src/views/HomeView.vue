<template>
  <v-container fill-height>
    <v-col>
      <v-row class="align-center justify-center">
        <v-btn
          x-large
          color="primary"
          class="ma-2"
          @click="goToPlay()"
          width="15%"
          >PLAY</v-btn
        >
      </v-row>
      <v-row class="align-center justify-center">
        <v-btn
          x-large
          color="primary"
          class="ma-2"
          @click="goToAchievements()"
          width="15%"
          >ACHIEVEMENTS</v-btn
        >
      </v-row>
      <v-row class="align-center justify-center">
        <v-btn
          x-large
          color="primary"
          class="ma-2"
          @click="goToStore()"
          width="15%"
          >STORE</v-btn
        >
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
import store from "@/store";

export default {
  name: "HomeView",
  data: () => ({
    currentUser: 1,
  }),
  methods: {
    async fetchUserAchievements(userId) {
      const achievementResponse = await fetch(
        `http://localhost:3000/user/${userId}/achievement`
      );
      const achievementData = await achievementResponse.json();
      return achievementData;
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
    this.currentUser = store.currentUser;
    store.achievements = await this.fetchUserAchievements(this.currentUser);
  },
  computed: {
    //
  },
};
</script>
