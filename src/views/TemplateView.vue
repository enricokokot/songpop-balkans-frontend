<template>
  <v-container fill-height justify-center>
    <h1>This is a template page</h1>
    <v-btn x-large color="primary" @click="goBack()">BACK</v-btn>
  </v-container>
</template>

<script>
import store from "@/store";

export default {
  name: "HomeView",
  data: () => ({
    //
  }),
  methods: {
    goBack() {
      this.$router.back();
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
