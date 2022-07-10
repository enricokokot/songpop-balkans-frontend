<template>
  <v-container>
    <!-- game status area -->
    <v-layout row align-center class="ma-6">
      <!-- profile 1 element (1) -->
      <v-flex fill-height text-center xs3 order-xs3 sm2 order-sm1>
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
      </v-flex>
      <!-- rounds element (2) -->
      <v-flex fill-height text-center xs6 order-xs1 sm2 order-sm2
        ><h3>Round {{ currentRound + 1 }} of 3</h3></v-flex
      >
      <!-- score element (3) -->
      <v-flex fill-height text-center xs6 order-xs4 sm4 order-sm3>
        <div class="align-center justify-center text-h3">
          {{ displayNumber }} - {{ displayNumber2 }}
        </div>
      </v-flex>
      <!-- time element (4) -->
      <v-flex fill-height text-center xs6 order-xs2 sm2 order-sm4
        ><div
          v-if="gameTimer > 100"
          class="align-center justify-center text-h5"
        >
          {{ Math.ceil((gameTimer - 100) / 10) }}
        </div>
        <div
          v-else-if="gameTimer <= 100 && gameTimer > 0"
          class="align-center justify-center text-h5"
        >
          {{ gameTimer / 10 }}
        </div>
        <div v-else class="align-center justify-center text-h5">0</div>
      </v-flex>
      <!-- profile 2 element (5) -->
      <v-flex fill-height text-center xs3 order-xs5 sm2 order-sm5
        ><div v-if="duelAgainst.name" class="align-center justify-center">
          <v-avatar color="primary" size="10vh">
            <span class="white--text text-h5">{{
              duelAgainst.name
                .split(" ")
                .map((word) => word[0])
                .join("")
            }}</span>
          </v-avatar>
        </div>
      </v-flex>
    </v-layout>
    <!-- warning area -->
    <v-layout class="ma-3" row wrap>
      <v-flex text-center>
        <h3 class="red--text">
          Moving off this screen before game ends may cause bugs!
        </h3>
      </v-flex>
    </v-layout>
    <!-- info area -->
    <v-layout class="ma-2" row wrap>
      <v-flex text-center>
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
        <h4 v-else>Important game info shown here</h4>
      </v-flex>
    </v-layout>
    <!-- answers area -->
    <v-layout class="ma-3">
      <v-flex>
        <transition name="slide" mode="out-in">
          <router-view @eventname="answer" />
        </transition>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import store from "@/store";
import { Auth, Users } from "@/services";

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
    gameTimer: 150,
    roundPoints: 0,
    totalPoints: 0,
    totalPointsPlayer: 0,
    currentUser: {},
    userId: Auth.state.user.userId,
    displayNumber: 0,
    displayNumber2: 0,
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
      this.totalPoints = this.totalPoints + this.roundPoints;
      this.totalPointsPlayer = Object.keys(this.duelAgainst.rounds)
        .filter((duel) => duel <= this.currentRound)
        .map((key) => this.duelAgainst.rounds[key].playerPointsEarned)
        .reduce((prev, curr) => prev + curr, 0);
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
    },
    nextRound() {
      this.currentRound = this.currentRound + 1;
      if (!this.duelAgainst.rounds[this.currentRound]) {
        store.duelAgainst.yourScore = this.totalPoints;
        this.$router.replace("/score");
      } else {
        this.roundYourAnswer = "";
        this.roundPoints = 0;
        this.answerGiven = false;
        this.gameTimePassed = false;
        this.gameTimer = 150;
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
    // TODO: fix doesn't activate if player doesn't answer
    totalPoints() {
      const interval1 = false;
      const interval2 = false;
      if (this.roundPoints !== 0) {
        clearInterval(interval1);
        clearInterval(interval2);

        this.interval = window.setInterval(() => {
          if (this.displayNumber != this.totalPoints) {
            var change = (this.totalPoints - this.displayNumber) / 10;
            change = change >= 0 ? Math.ceil(change) : Math.floor(change);
            this.displayNumber = this.displayNumber + change;
          }
        }, 20);

        this.interval2 = window.setInterval(() => {
          if (this.displayNumber2 != this.totalPointsPlayer) {
            const dn2 = this.displayNumber2;
            const tpp = this.totalPointsPlayer;
            var change = (this.totalPointsPlayer - this.displayNumber2) / 10;
            change = change >= 0 ? Math.ceil(change) : Math.floor(change);
            this.displayNumber2 = this.displayNumber2 + change;
          }
        }, 20);
      }
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
