<template>
  <v-container fill-height justify-center>
    <v-btn x-large color="primary" @click="goToPlay()">PLAY</v-btn>
    <v-btn x-large color="primary" @click="goToStore()">STORE</v-btn>
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
