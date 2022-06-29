<template>
  <v-container fill-height fluid>
    <v-snackbar v-model="snackbar1" :multi-line="multiLine">
      {{ text1 }}

      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbar1 = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar v-model="snackbar2" :multi-line="multiLine">
      {{ text2 }}

      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbar2 = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-row class="align-center justify-center">
      <v-col>
        <v-row class="align-center justify-center pa-2">
          <h1>This is the score page</h1>
        </v-row>
        <v-row class="align-center justify-center pa-2">
          <h3>You've managed to earn a result of</h3>
        </v-row>
        <v-row class="align-center justify-center pa-2">
          <h3>{{ finalScore }} - {{ enemyFinalScore }}</h3>
        </v-row>
        <v-row class="align-center justify-center pa-2">
          <h3 v-if="!enemyPlayed">
            We've sent your challenge to {{ duelAgainst.name.split(" ")[0] }} :)
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
        </v-row>
        <v-row class="align-center justify-center pa-2">
          <v-btn x-large color="primary" @click="goBack()" width="25%"
            >BACK</v-btn
          >
        </v-row>
      </v-col>
    </v-row>
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
    multiLine: true,
    snackbar1: false,
    snackbar2: false,
    text1: `Congratulations, you've earned the 'Earn a score of 250' achievement!`,
    text2: `Congratulations, you've earned the 'Earn a score of 300' achievement!`,
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
    else {
      const enemyPlayer = store.players.find(
        (player) => player.id === this.duelAgainst.id
      );
      enemyPlayer.status = "challenge";
      if (this.finalScore > this.enemyFinalScore) {
        enemyPlayer.result[0] += 1;
        store.coins += 3;
      } else if (this.finalScore < this.enemyFinalScore) {
        enemyPlayer.result[1] += 1;
        store.coins += 1;
      } else {
        enemyPlayer.result[0] += 1;
        enemyPlayer.result[1] += 1;
        store.coins += 2;
      }
    }
    if (this.finalScore >= 250) {
      store.achievements.find(
        (achievement) => achievement.id === 3
      ).progress = 1;
      this.snackbar1 = true;
    }
    if (this.finalScore >= 300) {
      store.achievements.find(
        (achievement) => achievement.id === 4
      ).progress = 1;
      this.snackbar2 = true;
    }
  },
  computed: {
    //
  },
};
</script>
