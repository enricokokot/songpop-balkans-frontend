<template>
  <v-container fill-height justify-center>
    <h1 v-if="duelAgainst.name">
      What do you want to duel {{ duelAgainst.name.split(" ")[0] }} in?
    </h1>
  </v-container>
</template>

<script>
import store from "@/store";

export default {
  name: "PrepareForDuelView",
  data: () => ({
    duelAgainst: {},
  }),
  methods: {
    //
  },
  mounted() {
    this.duelAgainst = store.duelAgainst;
  },
  computed: {
    //
  },
};
</script>
