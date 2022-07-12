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
          <h3>{{ userScore }}{{ enemyHasPlayed ? ` - ${rivalScore}` : "" }}</h3>
        </v-row>
        <v-row class="align-center justify-center pa-2">
          <h3 v-if="!enemyHasPlayed">
            We've sent your challenge to {{ rival.name.split(" ")[0] }} :)
          </h3>
          <h3 v-else-if="userScore > rivalScore">
            Congratulations, you've earned your 3 coins!
          </h3>
          <h3 v-else-if="userScore < rivalScore">
            The enemy was better, hope this (1) coin will help...
          </h3>
          <h3 v-else>
            It seems you've found your match, you've both earned 2 coins!
          </h3>
        </v-row>
        <v-row class="align-center justify-center pa-2">
          <v-btn x-large color="primary" @click="goBack()" width="25%"
            >CONTINUE</v-btn
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
    enemyHasPlayed: true,
    multiLine: true,
    snackbar1: false,
    snackbar2: false,
    text1: `Congratulations, you've earned the 'Earn a score of 250' achievement!`,
    text2: `Congratulations, you've earned the 'Earn a score of 300' achievement!`,
    userId: Auth.state.user.userId,
    rival: { name: "" },
    userScore: 0,
    rivalScore: 0,
  }),
  methods: {
    goBack() {
      this.$router.replace("/duel");
    },
    async startADuel(data) {
      const response = await Duels.start(data);
      return response;
    },
    async endADuel(data) {
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
    const { user, rival, duel } = store.duelResults;
    const rivalId = rival.id;
    const playlist = duel.playlist;
    const userScore = user.pointsEarned.reduce((prev, curr) => prev + curr, 0);
    const rivalScore = rival.pointsEarned.reduce(
      (prev, curr) => prev + curr,
      0
    );
    const { offeredAnswers, correctAnswers, correctAnswersIds } = duel;
    const rounds = {
      0: {
        songs: [],
        correctAnswer: "",
        correctAnswerId: 0,
        pointsEarned: 0,
        timeAnswered: 0,
        answer: "",
      },
      1: {
        songs: [],
        correctAnswer: "",
        correctAnswerId: 0,
        pointsEarned: 0,
        timeAnswered: 0,
        answer: "",
      },
      2: {
        songs: [],
        correctAnswer: "",
        correctAnswerId: 0,
        pointsEarned: 0,
        timeAnswered: 0,
        answer: "",
      },
    };
    const roundKeys = Object.keys(rounds);
    roundKeys.forEach(
      (roundKey) => (rounds[roundKey].songs = offeredAnswers[roundKey])
    );
    roundKeys.forEach(
      (roundKey) => (rounds[roundKey].correctAnswer = correctAnswers[roundKey])
    );
    roundKeys.forEach(
      (roundKey) =>
        (rounds[roundKey].correctAnswerId = correctAnswersIds[roundKey])
    );
    roundKeys.forEach(
      (roundKey) =>
        (rounds[roundKey].pointsEarned = user.pointsEarned[roundKey])
    );
    roundKeys.forEach(
      (roundKey) => (rounds[roundKey].timeAnswered = user.answerTimes[roundKey])
    );
    roundKeys.forEach(
      (roundKey) => (rounds[roundKey].answer = user.givenAnswers[roundKey])
    );
    const startDuelData = {
      challengerId: this.userId,
      challengeTakerId: rivalId,
      playlist: playlist,
      challengerScore: userScore,
      roundsData: rounds,
    };
    const endDuelData = {
      duelId: duel.id,
      challengeeScore: rivalScore,
    };
    /* TODO: could cause significant bugs, fix ASAP */
    const enemyHasPlayed = rival.givenAnswers.reduce(
      (prev, curr) => prev + curr,
      0
    );
    this.enemyHasPlayed = enemyHasPlayed;
    if (!enemyHasPlayed) {
      this.startADuel(startDuelData);
    } else {
      this.endADuel(endDuelData);
      if (userScore > rivalScore) {
        const achievementUpdate = await this.updateAnAchievement(0);
        achievementUpdate.goalReached
          ? console.log("goal reached!")
          : console.log("achievement updated!");
      }
    }
    if (userScore >= 250) {
      const achievementUpdate = await this.updateAnAchievement(3);
      if (achievementUpdate.goalReached) this.snackbar1 = true;
    }
    if (userScore >= 300) {
      const achievementUpdate = await this.updateAnAchievement(4);
      if (achievementUpdate.goalReached) this.snackbar2 = true;
    }
    this.rival = rival;
    this.userScore = userScore;
    this.rivalScore = rivalScore;
    store.duelResults = {};
  },
  computed: {
    //
  },
};
</script>
