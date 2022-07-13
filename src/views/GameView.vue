<template>
  <v-container>
    <!-- game status area -->
    <v-layout row align-center class="ma-6">
      <!-- profile 1 element (1) -->
      <v-flex fill-height text-center xs3 order-xs3 sm2 order-sm1>
        <v-avatar color="primary" size="10vh">
          <span v-if="user.name" class="white--text text-h5">
            {{
              user.name
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
          {{ dynamicPlayerTotal }} - {{ dynamicRivalTotal }}
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
        ><div v-if="rival.name" class="align-center justify-center">
          <v-avatar color="primary" size="10vh">
            <span class="white--text text-h5">{{
              rival.name
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
          v-if="
            answerGiven &&
            user.givenAnswers[currentRound] === roundDetails.correctAnswer
          "
        >
          Well done, you've earned {{ user.pointsEarned[currentRound] }} points!
        </h4>
        <h4
          v-else-if="
            answerGiven &&
            user.givenAnswers[currentRound] !== roundDetails.correctAnswer
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
        <RoundAnswers
          :duel="duel"
          :user="user"
          :rival="rival"
          :gameTimer="gameTimer"
          :currentRound="currentRound"
          :roundDetails="roundDetails"
          :roundIsOver="roundIsOver"
          :answerGiven="answerGiven"
          @eventname="answer"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import store from "@/store";
import { Auth, Users, Songs } from "@/services";
import RoundAnswers from "@/components/RoundAnswers";

export default {
  name: "GameView",
  components: { RoundAnswers },
  data: () => ({
    user: { pointsEarned: [0, 0, 0] },
    rival: { pointsEarned: [0, 0, 0] },
    duel: {},
    currentRound: 0,
    roundDetails: {},
    answerGiven: false,
    gameTimePassed: false,
    gameTimer: 130,
    userId: Auth.state.user.userId,
    dynamicPlayerTotal: 0,
    dynamicRivalTotal: 0,
    ctx: {},
    currGain: {},
    gainNode: {},
    songIsPlaying: false,
  }),
  methods: {
    async fetchASongAudio(songId) {
      const songAudio = await Songs.getAudio(songId);
      return songAudio;
    },
    answer(songId) {
      const currentRound = this.currentRound;
      this.user.givenAnswers[currentRound] = songId;
      const playerAnswer = this.user.givenAnswers[currentRound];
      const correctAnswer = this.roundDetails.correctAnswer;

      this.user.givenAnswers[currentRound] = songId;
      this.user.answerTimes[currentRound] = this.gameTimer;
      this.user.pointsEarned[currentRound] =
        playerAnswer === correctAnswer ? this.gameTimer : 0;
      this.answerGiven = !this.answerGiven;
      this.gameTimer = 0;
    },
    async prepareForTheNextRound() {
      const currentRound = this.currentRound;
      const duel = this.duel;
      const rival = this.rival;

      const roundAnswers = duel.offeredAnswers[currentRound];
      const roundCorrectAnswer = duel.correctAnswers[currentRound];
      const roundRivalAnswer = rival.givenAnswers[currentRound];
      const roundRivalAnswerTime = rival.answerTimes[currentRound];

      this.roundDetails = {
        answers: roundAnswers,
        correctAnswer: roundCorrectAnswer,
        rivalAnswer: roundRivalAnswer,
        rivalAnswerTime: roundRivalAnswerTime,
        isOver: false,
      };

      const songAudioId = duel.correctAnswersIds[currentRound];
      const songAudio = await this.fetchASongAudio(songAudioId);
      //   const songAudio = store.songAudios[this.currentRound];

      const ctx = new AudioContext();
      let decodedAudio = {};
      try {
        decodedAudio = await ctx.decodeAudioData(songAudio);
      } catch (e) {
        store.snackbar = true;
        this.$router.replace("/duel");
      }
      this.gameTimer -= 1;
      const source = ctx.createBufferSource();
      source.buffer = decodedAudio;
      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.5;
      let currGain = gainNode.gain.value;
      source.connect(gainNode);
      gainNode.connect(ctx.destination);
      this.playSong(source, ctx);

      this.gainNode = gainNode;
      this.currGain = currGain;
      this.ctx = ctx;
    },
    playSong(source) {
      setTimeout(() => source.start(), 2000);
    },
    stopSong() {
      this.currGain = 0;
      this.gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.ctx.currentTime + 5
      );
    },
    nextRound() {
      this.currentRound += 1;
      if (this.currentRound >= this.duel.offeredAnswers.length) {
        store.duelResults = {
          user: this.user,
          rival: this.rival,
          duel: this.duel,
          roundDetails: this.roundDetails,
        };
        this.$router.replace("/score");
      } else {
        this.answerGiven = false;
        this.gameTimePassed = false;
        this.gameTimer = 130;
        this.prepareForTheNextRound();
      }
    },
    async fetchCurrentUser() {
      const user = await Users.getOne(this.userId);
      return user;
    },
  },
  async mounted() {
    const userDetails = await this.fetchCurrentUser();
    const duelDetails = store.duelAgainst;

    const roundKeys = Object.keys(duelDetails.rounds);
    const givenAnswers = roundKeys.map(
      (roundKey) => duelDetails.rounds[roundKey].playerAnswer
    );
    const answerTimes = roundKeys.map(
      (roundKey) => duelDetails.rounds[roundKey].playerTimeAnswered
    );
    const pointsEarned = roundKeys.map(
      (roundKey) => duelDetails.rounds[roundKey].playerPointsEarned
    );
    const correctAnswers = roundKeys.map(
      (roundKey) => duelDetails.rounds[roundKey].correctAnswer
    );
    const correctAnswersIds = roundKeys.map(
      (roundKey) => duelDetails.rounds[roundKey].correctAnswerId
    );
    const offeredAnswers = roundKeys.map(
      (roundKey) => duelDetails.rounds[roundKey].songs
    );

    this.user = {
      id: userDetails.id,
      name: userDetails.username,
      givenAnswers: ["", "", ""],
      answerTimes: [0, 0, 0],
      pointsEarned: [0, 0, 0],
    };
    this.rival = {
      id: duelDetails.id,
      name: duelDetails.name,
      givenAnswers,
      answerTimes,
      pointsEarned,
    };
    this.duel = {
      id: duelDetails.duelId,
      startTime: duelDetails.duelStartTime,
      playlist: duelDetails.playlist,
      resultSoFar: duelDetails.results,
      offeredAnswers,
      correctAnswers,
      correctAnswersIds,
    };

    this.prepareForTheNextRound();
  },
  computed: {
    roundIsOver() {
      return this.gameTimer <= 0 || this.answerGiven;
    },
    playerTotal() {
      const resultBeforeAnswer = this.user.pointsEarned
        .slice(0, this.currentRound)
        .reduce((prev, curr) => prev + curr, 0);
      const resultAfterAnswer = this.user.pointsEarned
        .slice(0, this.currentRound + 1)
        .reduce((prev, curr) => prev + curr, 0);
      return this.roundIsOver ? resultAfterAnswer : resultBeforeAnswer;
    },
    rivalTotal() {
      const resultBeforeAnswer = this.rival.pointsEarned
        .slice(0, this.currentRound)
        .reduce((prev, curr) => prev + curr, 0);
      const resultAfterAnswer = this.rival.pointsEarned
        .slice(0, this.currentRound + 1)
        .reduce((prev, curr) => prev + curr, 0);
      return this.roundIsOver ? resultAfterAnswer : resultBeforeAnswer;
    },
  },
  watch: {
    gameTimer: {
      handler(value) {
        if (value < 130 && value > 0) {
          setTimeout(() => {
            this.gameTimer--;
          }, 100);
        }
        if (value === 0) {
          this.gameTimePassed = !this.gameTimePassed;
          this.stopSong();
        }
      },
      immediate: true,
    },
    roundIsOver() {
      this.roundIsOver && setTimeout(() => this.nextRound(), 2000);
    },
    playerTotal() {
      let interval = false;
      // clearInterval(interval);

      if (this.playerTotal == this.dynamicPlayerTotal) {
        return;
      }

      interval = window.setInterval(() => {
        if (this.dynamicPlayerTotal != this.playerTotal) {
          let change = (this.playerTotal - this.dynamicPlayerTotal) / 10;
          change = change >= 0 ? Math.ceil(change) : Math.floor(change);
          this.dynamicPlayerTotal = this.dynamicPlayerTotal + change;
        }
      }, 20);
    },
    rivalTotal() {
      let interval = false;
      // clearInterval(interval);

      if (this.rivalTotal == this.dynamicRivalTotal) {
        return;
      }

      interval = window.setInterval(() => {
        if (this.dynamicRivalTotal != this.rivalTotal) {
          let change = (this.rivalTotal - this.dynamicRivalTotal) / 10;
          change = change >= 0 ? Math.ceil(change) : Math.floor(change);
          this.dynamicRivalTotal = this.dynamicRivalTotal + change;
        }
      }, 20);
    },
  },
};
</script>
