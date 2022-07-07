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
import { Auth, Users, Duels } from "@/services";

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
    userId: Auth.state.user.userId,
  }),
  methods: {
    goBack() {
      this.$router.replace("/duel");
    },
    async startADuel() {
      const data = {
        challengerId: this.userId,
        challengeTakerId: this.duelAgainst.id,
        playlist: this.duelAgainst.playlist,
        challengerScore: this.finalScore,
        roundsData: this.duelAgainst.rounds,
      };
      const response = await Duels.start(data);
      return response;
    },
    async endADuel() {
      const data = {
        duelId: this.duelAgainst.duelId,
        chalengeeScore: this.finalScore,
      };
      const response = await Duels.end(data);
      return response;
    },
    async updateAnAchievement(achievementId) {
      const usersPlaylists = await Users.updateAchievement(
        this.userId,
        achievementId
      );
      return usersPlaylists;
    },
  },
  async mounted() {
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
    if (!this.enemyPlayed) {
      this.startADuel();
    } else {
      this.endADuel();
      if (this.finalScore > this.enemyFinalScore) {
        const achievementUpdate = await this.updateAnAchievement(0);
        achievementUpdate.goalReached
          ? console.log("goal reached!")
          : console.log("achievement updated!");
      }
    }
    if (this.finalScore >= 250) {
      const achievementUpdate = await this.updateAnAchievement(3);
      if (achievementUpdate.goalReached) this.snackbar1 = true;
    }
    if (this.finalScore >= 300) {
      const achievementUpdate = await this.updateAnAchievement(4);
      if (achievementUpdate.goalReached) this.snackbar2 = true;
    }
  },
  computed: {
    //
  },
};
</script>
