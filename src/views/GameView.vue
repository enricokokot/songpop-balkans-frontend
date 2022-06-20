<template>
  <v-container fill-height justify-center>
    <h1 class="red--text">
      Moving off this screen can cause bugs, proceed at your own peril
    </h1>
    <h1 v-if="duelAgainst.name">
      You are playing against {{ duelAgainst.name.split(" ")[0] }}
      <h4
        v-if="answerGiven && this.roundYourAnswer === this.roundCorrectAnswer"
      >
        Well done, you've earned {{ roundPoints }} points!
      </h4>
      <h4
        v-else-if="
          answerGiven && this.roundYourAnswer !== this.roundCorrectAnswer
        "
      >
        Sorry, that wasn't very correct...
      </h4>
      <h4 v-else-if="gameTimer <= 0">Time's up!</h4>
      <h4 v-else>
        {{ gameTimer }}
        {{ totalPoints }}
      </h4>
    </h1>
    <v-main v-for="song in roundSongs" :key="song">
      <v-btn
        v-if="
          !answerGiven &&
          song === roundPlayerAnswer &&
          gameTimer <= roundPlayerAnswerTime &&
          gameTimer !== 0
        "
        x-large
        color="warning"
        @click="answer(song)"
        >{{ song }}</v-btn
      >
      <v-btn
        v-else-if="!answerGiven && !gameTimePassed"
        x-large
        color="primary"
        @click="answer(song)"
        >{{ song }}</v-btn
      >
      <v-btn
        v-else-if="
          (answerGiven || gameTimePassed) && song === roundCorrectAnswer
        "
        x-large
        color="success"
        >{{ song }}</v-btn
      >
      <v-btn
        v-else-if="
          (answerGiven || gameTimePassed) && song === roundPlayerAnswer
        "
        x-large
        color="warning"
        >{{ song }}</v-btn
      >
      <v-btn
        v-else-if="(answerGiven || gameTimePassed) && song === roundYourAnswer"
        x-large
        color="error"
        >{{ song }}</v-btn
      >
      <v-btn v-else x-large color="primary" disabled>{{ song }}</v-btn>
    </v-main>
    <v-btn
      v-if="answerGiven || gameTimePassed"
      x-large
      color="error"
      @click="goBack()"
      >QUIT</v-btn
    >
    <v-btn v-else x-large color="error" @click="goBack()" disabled>QUIT</v-btn>
    <v-btn v-if="gameTimePassed" x-large color="primary" @click="nextRound()"
      >NEXT ROUND</v-btn
    >
    <v-btn v-else x-large color="primary" disabled>NEXT ROUND</v-btn>
    <h2>TOTAL SCORE: {{ totalPoints }} - {{ totalPointsPlayer }}</h2>
  </v-container>
</template>

<script>
import store from "@/store";

export default {
  name: "GameView",
  data: () => ({
    duelAgainst: {},
    currentRound: 0,
    roundSongs: [],
    roundCorrectAnswer: "",
    roundPlayerAnswer: "",
    roundPlayerAnswerTime: 0,
    roundYourAnswer: "",
    answerGiven: false,
    gameTimePassed: false,
    gameTimer: 5,
    roundPoints: 0,
    totalPoints: 0,
    totalPointsPlayer: 0,
    audio: {},
  }),
  methods: {
    goBack() {
      this.$router.back();
    },
    answer(songId) {
      this.roundYourAnswer = songId;
      this.answerGiven = !this.answerGiven;
      this.roundPoints =
        this.roundYourAnswer === this.roundCorrectAnswer
          ? this.gameTimer * 10
          : 0;
    },
    prepareForTheNextRound() {
      this.roundSongs = this.duelAgainst.rounds[this.currentRound].songs;
      this.roundCorrectAnswer =
        this.duelAgainst.rounds[this.currentRound].correctAnswer;
      this.roundPlayerAnswer =
        this.duelAgainst.rounds[this.currentRound].playerAnswer;
      this.roundPlayerAnswerTime =
        this.duelAgainst.rounds[this.currentRound].playerTimeAnswered;
      const songAudio = this.duelAgainst.rounds[this.currentRound].audio;
      this.audio = new Audio(songAudio);
      this.audio.play();
    },

    nextRound() {
      this.stopSong();
      this.totalPointsPlayer =
        this.totalPointsPlayer +
        this.duelAgainst.rounds[this.currentRound].playerPointsEarned;
      this.currentRound = this.currentRound + 1;
      this.totalPoints = this.totalPoints + this.roundPoints;
      if (!this.duelAgainst.rounds[this.currentRound]) {
        store.duelAgainst.yourScore = this.totalPoints;
        this.$router.replace("/score");
      } else {
        this.roundYourAnswer = "";
        this.roundPoints = 0;
        this.answerGiven = false;
        this.gameTimePassed = false;
        this.gameTimer = 5;
        this.prepareForTheNextRound();
      }
    },
    stopSong() {
      this.audio.pause();
    },
  },
  mounted() {
    this.duelAgainst = store.duelAgainst;
    this.prepareForTheNextRound();
  },
  computed: {
    //
  },
  watch: {
    gameTimer: {
      handler(value) {
        if (value > 0) {
          setTimeout(() => {
            this.gameTimer--;
          }, 1000);
        }
        if (value === 0) {
          this.gameTimePassed = !this.gameTimePassed;
          this.stopSong();
        }
      },
      immediate: true,
    },
  },
};
</script>
