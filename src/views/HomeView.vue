<template>
  <v-container fill-height justify-center>
    <v-col></v-col>
    <v-col>
      <v-btn x-large color="primary" class="pa-0 ma-2" @click="goToPlay()"
        >PLAY</v-btn
      >
      <v-btn x-large color="primary" class="pa-0 ma-2" @click="goToStore()"
        >STORE</v-btn
      >
    </v-col>
    <v-col></v-col>
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
