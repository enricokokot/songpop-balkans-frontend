<template>
  <v-container fill-height>
    <v-row class="align-center justify-center">
      <v-btn
        x-large
        color="primary"
        class="ma-2"
        @click="goToPlay()"
        width="15%"
        >PLAY</v-btn
      >
      <v-btn
        x-large
        color="primary"
        class="ma-2"
        @click="goToStore()"
        width="15%"
        >STORE</v-btn
      >
    </v-row>
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
      this.$router.push("/duel");
    },
    goToStore() {
      this.$router.push("/store");
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
