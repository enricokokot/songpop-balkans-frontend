<template>
  <v-container fill-height justify-center>
    <h1>This is the score page</h1>
    <h3>{{ finalScore }} - {{ enemyFinalScore }}</h3>
    <h3 v-if="finalScore > enemyFinalScore">
      Congratulations, you've earned your 3 coins!
    </h3>
    <h3 v-else-if="finalScore < enemyFinalScore">
      The enemy was better, hope this (1) coin will help...
    </h3>
    <h3 v-else>
      It seems you've found your match, you've both earned 2 coins!
    </h3>
    <v-btn x-large color="primary" @click="goBack()">BACK</v-btn>
  </v-container>
</template>

<script>
import store from "@/store";

export default {
  name: "HomeView",
  data: () => ({
    finalScore: 0,
    enemyFinalScore: 0,
  }),
  methods: {
    goBack() {
      this.$router.replace("/duel");
    },
  },
  mounted() {
    this.finalScore = store.duelAgainst.yourScore;
    const enemyFinalScoreToBe = [];
    Object.keys(store.duelAgainst.rounds).forEach((key) =>
      enemyFinalScoreToBe.push(store.duelAgainst.rounds[key].playerPointsEarned)
    );
    this.enemyFinalScore = enemyFinalScoreToBe.reduce(
      (prev, curr) => prev + curr,
      0
    );
  },
  computed: {
    //
  },
};
</script>
