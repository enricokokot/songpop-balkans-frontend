<template>
  <v-container fill-height fluid>
    <v-row class="align-center justify-center">
      <v-col>
        <v-row class="align-center justify-center">
          <v-spacer></v-spacer>
          <v-col
            ><v-row class="align-center justify-center">
              <v-avatar color="primary" size="10vh">
                <span class="white--text text-h5">{{
                  "Ivan Merlić"
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                }}</span>
              </v-avatar>
            </v-row></v-col
          >
          <v-col
            ><v-row class="align-center justify-center text-h5"
              >Round {{ currentRound + 1 }} of 3</v-row
            ></v-col
          >
          <v-col
            ><v-row class="align-center justify-center text-h3"
              >{{ totalPoints }} - {{ totalPointsPlayer }}</v-row
            ></v-col
          >
          <v-col
            ><v-row
              v-if="gameTimer >= 0"
              class="align-center justify-center text-h5"
              >{{ gameTimer }}</v-row
            >
            <v-row v-else class="align-center justify-center text-h5">0</v-row>
          </v-col>
          <v-col>
            <v-row v-if="duelAgainst.name" class="align-center justify-center">
              <v-avatar color="primary" size="10vh">
                <span class="white--text text-h5">{{
                  duelAgainst.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                }}</span>
              </v-avatar>
            </v-row></v-col
          >
          <v-spacer></v-spacer>
        </v-row>
        <v-row class="align-center justify-center">
          <h1 class="red--text ma-6">
            Moving off this screen can cause bugs, proceed at your own peril
          </h1></v-row
        >
        <v-row class="align-center justify-center ma-6">
          <h4
            v-if="
              answerGiven && this.roundYourAnswer === this.roundCorrectAnswer
            "
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
          <h4 v-else>Important game info shown here</h4>
        </v-row>
        <v-row class="align-center justify-center">
          <v-col>
            <v-row
              v-for="song in roundSongs"
              :key="song"
              class="align-center justify-center"
            >
              <v-btn
                v-if="
                  !answerGiven &&
                  song === roundPlayerAnswer &&
                  gameTimer <= roundPlayerAnswerTime &&
                  gameTimer !== 0
                "
                x-large
                class="ma-2"
                color="warning"
                @click="answer(song)"
                width="25%"
                >{{ song }}</v-btn
              >
              <v-btn
                v-else-if="!answerGiven && !gameTimePassed"
                x-large
                class="ma-2"
                color="primary"
                @click="answer(song)"
                width="25%"
                >{{ song }}</v-btn
              >
              <v-btn
                v-else-if="
                  (answerGiven || gameTimePassed) && song === roundCorrectAnswer
                "
                x-large
                class="ma-2"
                color="success"
                width="25%"
                >{{ song }}</v-btn
              >
              <v-btn
                v-else-if="
                  (answerGiven || gameTimePassed) && song === roundPlayerAnswer
                "
                x-large
                class="ma-2"
                color="warning"
                width="25%"
                >{{ song }}</v-btn
              >
              <v-btn
                v-else-if="
                  (answerGiven || gameTimePassed) && song === roundYourAnswer
                "
                x-large
                class="ma-2"
                color="error"
                width="25%"
                >{{ song }}</v-btn
              >
              <v-btn
                v-else
                x-large
                class="ma-2"
                color="primary"
                disabled
                width="25%"
                >{{ song }}</v-btn
              >
            </v-row>
            <v-row class="align-center justify-center mt-8">
              <v-btn
                v-if="gameTimePassed"
                x-large
                class="ma-2"
                color="primary"
                @click="nextRound()"
                width="25%"
                >NEXT ROUND</v-btn
              >
              <v-btn
                v-else
                x-large
                class="ma-2"
                width="25%"
                color="primary"
                disabled
                >NEXT ROUND</v-btn
              >
            </v-row>
            <v-row class="align-center justify-center"
              ><v-btn
                v-if="answerGiven || gameTimePassed"
                x-large
                class="ma-2"
                color="error"
                @click="goBack()"
                width="25%"
                >QUIT</v-btn
              >
              <v-btn
                v-else
                x-large
                class="ma-2"
                color="error"
                @click="goBack()"
                width="25%"
                disabled
                >QUIT</v-btn
              >
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
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
    gameTimer: 10,
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
      this.gameTimer = 0;
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
        this.gameTimer = 10;
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
