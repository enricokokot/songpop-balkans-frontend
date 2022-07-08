<template>
  <v-container fill-height justify-center>
    <v-col>
      <v-row v-for="song in roundSongs" :key="song" class="justify-center">
        <v-badge
          :value="answerGiven && song === roundYourAnswer"
          avatar
          bordered
          overlap
          left
          offset-x="20"
          offset-y="20"
        >
          <template v-slot:badge>
            <v-avatar color="primary">
              <span v-if="currentUser.username">
                {{
                  currentUser.username
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                }}
              </span>
            </v-avatar>
          </template>
          <v-badge
            :value="
              gameTimer <= roundPlayerAnswerTime && song === roundPlayerAnswer
            "
            avatar
            bordered
            overlap
            offset-x="20"
            offset-y="20"
          >
            <template v-slot:badge>
              <v-avatar color="primary">
                <span v-if="currentUser.username">
                  {{
                    duelAgainst.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                  }}
                </span>
              </v-avatar>
            </template>
            <v-btn
              x-large
              class="ma-2"
              :color="
                (answerGiven || gameTimer <= 0) && song === roundCorrectAnswer
                  ? 'success'
                  : 'primary'
              "
              style="width: 300px"
              @click="roundIsOver && answer(song)"
              >{{ song }}</v-btn
            >
          </v-badge>
        </v-badge>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
import store from "@/store";
import { Auth, Users, Songs } from "@/services";

export default {
  name: "GameAnswers",
  data: () => ({
    duelAgainst: {},
    currentRound: 2,
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
    ctx: {},
    currGain: {},
    gainNode: {},
  }),
  methods: {
    goBack() {
      this.$router.back();
    },
    async fetchASongAudio(songId) {
      const songAudio = await Songs.getAudio(songId);
      return songAudio;
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
      store.duelAgainst = this.duelAgainst;
      this.$emit("eventname", songId);
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
      const songAudio = await this.fetchASongAudio(songAudioId);
      //   const songAudio = store.songAudios[this.currentRound];
      const ctx = new AudioContext();
      const decodedAudio = await ctx.decodeAudioData(songAudio);
      const source = ctx.createBufferSource();
      source.buffer = decodedAudio;
      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.5;
      let currGain = gainNode.gain.value;
      source.connect(gainNode);
      gainNode.connect(ctx.destination);
      this.gainNode = gainNode;
      this.currGain = currGain;
      this.ctx = ctx;
      this.playSong(source, ctx);
    },
    playSong(source) {
      source.start();
    },
    stopSong() {
      this.currGain = 0;
      this.gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.ctx.currentTime + 5
      );
    },
    nextRound() {
      this.stopSong();
      this.totalPointsPlayer =
        this.totalPointsPlayer +
        this.duelAgainst.rounds[this.currentRound].playerPointsEarned;
      this.currentRound = this.currentRound + 1;
      this.totalPoints = this.totalPoints + this.roundPoints;
      //   if (!this.duelAgainst.rounds[this.currentRound]) {
      //     store.duelAgainst.yourScore = this.totalPoints;
      //     this.$router.replace("/score");
      //   } else {
      // this.roundYourAnswer = "";
      // this.roundPoints = 0;
      // this.answerGiven = false;
      // this.gameTimePassed = false;
      // this.gameTimer = 110;
      // this.prepareForTheNextRound();
      //     this.$router.replace({ name: "round2" });
      //   }
    },
    async fetchCurrentUser() {
      const user = await Users.getOne(this.userId);
      return user;
    },
  },
  async mounted() {
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
          this.stopSong();
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
