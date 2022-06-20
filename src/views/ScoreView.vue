<template>
  <v-container fill-height justify-center>
    <h1>This is the score page</h1>
    <h3>{{ finalScore }} - {{ enemyFinalScore }}</h3>
    <h3 v-if="!enemyPlayed">
      We've sent your offer to {{ duelAgainst.name.split(" ")[0] }} :)
    </h3>
    <h3 v-else-if="finalScore > enemyFinalScore">
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
    duelAgainst: {},
    finalScore: 0,
    enemyFinalScore: 0,
    enemyPlayed: true,
  }),
  methods: {
    goBack() {
      this.$router.replace("/duel");
    },
  },
  mounted() {
    this.finalScore = store.duelAgainst.yourScore;
    this.duelAgainst = store.duelAgainst;
    const enemyFinalScoreToBe = [];
    const enemyHasPlayed = [];
    Object.keys(store.duelAgainst.rounds).forEach((key) =>
      enemyFinalScoreToBe.push(store.duelAgainst.rounds[key].playerPointsEarned)
    );
    Object.keys(store.duelAgainst.rounds).forEach((key) =>
      enemyHasPlayed.push(store.duelAgainst.rounds[key].playerTimeAnswered)
    );
    this.enemyFinalScore = enemyFinalScoreToBe.reduce(
      (prev, curr) => prev + curr,
      0
    );
    this.enemyPlayed = enemyHasPlayed.reduce((prev, curr) => prev + curr, 0);
    if (!this.enemyPlayed)
      store.players.find((player) => player.id === this.duelAgainst.id).status =
        "waiting";
    else
      store.players.find((player) => player.id === this.duelAgainst.id).status =
        "challenge";
  },
  computed: {
    //
  },
};
</script>
