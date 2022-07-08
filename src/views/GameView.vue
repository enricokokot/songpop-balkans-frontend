<template>
  <v-container fill-height fluid>
    <v-row class="align-center justify-center" style="height: 200px">
      <v-col>
        <!-- game status area-->
        <v-row class="align-center justify-center">
          <v-spacer></v-spacer>
          <v-col
            ><v-row class="align-center justify-center">
              <v-avatar color="primary" size="10vh">
                <span v-if="currentUser.username" class="white--text text-h5">
                  {{
                    currentUser.username
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                  }}
                </span>
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
              >{{ gameTimer / 10 }}</v-row
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
        <!-- warning area -->
        <v-row class="align-center justify-center">
          <h1 class="red--text ma-6">
            Moving off this screen can cause bugs, proceed at your own peril
          </h1></v-row
        >
        <!-- info area -->
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
        <!-- answers area -->
      </v-col>
    </v-row>
    <v-row class="align-center justify-center" style="height: 200px">
      <v-col>
        <v-row class="align-center justify-center">
          <transition name="slide" mode="out-in">
            <router-view @eventname="answer" />
          </transition>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import store from "@/store";
import { Auth, Users, Songs } from "@/services";

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
    gameTimer: 110,
    roundPoints: 0,
    totalPoints: 0,
    totalPointsPlayer: 0,
    currentUser: {},
    userId: Auth.state.user.userId,
  }),
  methods: {
    goBack() {
      this.$router.back();
    },
    answer(songId) {
      this.roundYourAnswer = songId;
      this.answerGiven = !this.answerGiven;
      this.roundPoints =
        this.roundYourAnswer === this.roundCorrectAnswer ? this.gameTimer : 0;
      this.duelAgainst.rounds[this.currentRound].timeAnswered = this.gameTimer;
      this.gameTimer = 0;
      this.duelAgainst.rounds[this.currentRound].pointsEarned =
        this.roundPoints;
      this.duelAgainst.rounds[this.currentRound].answer = this.roundYourAnswer;
    },
    async prepareForTheNextRound() {
      this.roundSongs = this.duelAgainst.rounds[this.currentRound].songs;
      this.roundCorrectAnswer =
        this.duelAgainst.rounds[this.currentRound].correctAnswer;
      this.roundPlayerAnswer =
        this.duelAgainst.rounds[this.currentRound].playerAnswer;
      this.roundPlayerAnswerTime =
        this.duelAgainst.rounds[this.currentRound].playerTimeAnswered;
      const songAudioId =
        this.duelAgainst.rounds[this.currentRound].correctAnswerId;
    },
    nextRound() {
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
        this.gameTimer = 110;
        this.prepareForTheNextRound();
      }
    },
    async fetchCurrentUser() {
      const user = await Users.getOne(this.userId);
      return user;
    },
  },
  async mounted() {
    this.$router.replace({
      name: "round1",
      params: {},
    });
    this.currentUser = await this.fetchCurrentUser();
    this.duelAgainst = store.duelAgainst;
    this.prepareForTheNextRound();
  },
  computed: {
    roundIsOver() {
      return this.gameTimer > 0 && !this.answerGiven;
    },
  },
  watch: {
    gameTimer: {
      handler(value) {
        if (value > 0) {
          setTimeout(() => {
            this.gameTimer--;
          }, 100);
        }
        if (value === 0) {
          this.gameTimePassed = !this.gameTimePassed;
        }
      },
      immediate: true,
    },
    roundIsOver(roundIsNotOver, roundIsOver) {
      roundIsOver && setTimeout(() => this.nextRound(), 2000);
    },
  },
};
</script>

<style>
/* slide */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.slide-enter,
.slide-leave-to {
  opacity: 0;
  transform: translateX(-30%);
}
</style>
