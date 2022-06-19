<template>
  <v-container fill-height justify-center>
    <h1>This is the store page</h1>
    <v-btn x-large color="primary" @click="goBack()">BACK </v-btn>
  </v-container>
</template>

<script>
export default {
  name: "StoreView",
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
