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
export default {
  name: "HomeView",
  data: () => ({
    //
  }),
  methods: {
    goToPlay() {
      this.$router.push("/app2/duel");
    },
    goToAchievements() {
      this.$router.push("/app2/achievements");
    },
    goToStore() {
      this.$router.push("/app2/store");
    },
  },
  mounted() {
    //
  },
  computed: {
    //
  },
};
</script>
