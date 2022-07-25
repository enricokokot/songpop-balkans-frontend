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
          <h3>
            {{ userScore
            }}{{
              enemyHasPlayed === "undefinedundefinedundefined" ||
              enemyHasGivenAnswer === 0
                ? ` - ${rivalScore}`
                : ""
            }}
          </h3>
        </v-row>
        <v-row class="align-center justify-center pa-2">
          <h3
            v-if="
              enemyHasPlayed !== 'undefinedundefinedundefined' ||
              enemyHasGivenAnswer !== 0
            "
          >
            We've sent your challenge to {{ rival.name.split(" ")[0] }}!
          </h3>
          <h3 v-else-if="userScore > rivalScore" class="text-center">
            Congratulations, you've earned your 3 coins!
          </h3>
          <h3 v-else-if="userScore < rivalScore" class="text-center">
            The enemy was better, hope this (1) coin will help...
          </h3>
          <h3 v-else class="text-center">
            It seems you've found your match, you've both earned 2 coins!
          </h3>
        </v-row>
        <v-row class="align-center justify-center pa-2">
          <v-btn x-large color="primary" @click="goBack()" style="width: 300px"
            >CONTINUE</v-btn
          >
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import store from "@/store";
import { Auth, Users, Duels } from "@/services";
import { Rival, Round, Rounds } from "@/types";

export default Vue.extend({
  name: "HomeView",
  data: () => ({
    enemyHasPlayed: "",
    enemyHasGivenAnswer: 0,
    multiLine: true,
    snackbar1: false,
    snackbar2: false,
    text1: `Congratulations, you've earned the 'Earn a score of 250' achievement!`,
    text2: `Congratulations, you've earned the 'Earn a score of 300' achievement!`,
    userId: Auth.state.user.userId as string,
    rival: {} as Rival,
    userScore: 0,
    rivalScore: 0,
  }),
  methods: {
    goBack() {
      this.$router.replace("/duel");
    },
    async startADuel(data: {
      challengerId: string;
      challengeTakerId: string;
      playlist: string;
      challengerScore: number;
      roundsData: Rounds;
    }) {
      const response = await Duels.start(data);
      return response;
    },
    async endADuel(data: { duelId: string; challengeeScore: number }) {
      const response = await Duels.end(data);
      return response;
    },
    async updateAnAchievement(achievementId: number) {
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
    const rounds: { [key: number]: Round } = {
      0: {
        songs: [],
        correctAnswer: "",
        correctAnswerId: "",
        pointsEarned: 0,
        timeAnswered: 0,
        answer: "",
        playerTimeAnswered: 0,
        playerPointsEarned: 0,
        playerAnswer: "",
      },
      1: {
        songs: [],
        correctAnswer: "",
        correctAnswerId: "",
        pointsEarned: 0,
        timeAnswered: 0,
        answer: "",
        playerTimeAnswered: 0,
        playerPointsEarned: 0,
        playerAnswer: "",
      },
      2: {
        songs: [],
        correctAnswer: "",
        correctAnswerId: "",
        pointsEarned: 0,
        timeAnswered: 0,
        answer: "",
        playerTimeAnswered: 0,
        playerPointsEarned: 0,
        playerAnswer: "",
      },
    };
    const beforeRoundKeys = Object.keys(rounds);
    const roundKeys = beforeRoundKeys.map((key) => Number(key));
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
      playlist,
      challengerScore: userScore,
      roundsData: rounds,
    };
    const endDuelData = {
      duelId: duel.id,
      challengeeScore: userScore,
    };
    /* TODO: could cause significant bugs, fix ASAP */
    const enemyHasPlayed = rival.givenAnswers.reduce(
      (prev, curr) => prev + curr,
      ""
    );
    const enemyHasGivenAnswer = rival.answerTimes.reduce(
      (prev, curr) => prev + curr,
      0
    );
    this.enemyHasGivenAnswer = enemyHasGivenAnswer;

    if (
      enemyHasPlayed === "undefinedundefinedundefined" ||
      enemyHasGivenAnswer === 0
    ) {
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
    // store.duelResults = {};
  },
  computed: {
    //
  },
});
</script>
