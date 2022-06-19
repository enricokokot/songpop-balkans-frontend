<template>
  <v-container fill-height justify-center>
    <v-btn x-large color="primary" @click="consoleLog()">PLAY</v-btn>
    <v-btn x-large color="primary" @click="consoleLog()">STORE</v-btn>
  </v-container>
</template>

<script>
export default {
  name: "HomeView",
  data: () => ({
    //
  }),
  methods: {
    consoleLog: () => {
      console.log("clicked!");
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
