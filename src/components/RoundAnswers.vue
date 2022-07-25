<template>
  <v-container fill-height justify-center>
    <v-layout align-center justify-center row wrap style="max-width: 625px">
      <transition-group name="slide">
        <v-flex
          v-for="answer in roundDetails.answers"
          :key="answer"
          class="text-center"
          md6
        >
          <v-badge
            :value="answerGiven && answer === user.givenAnswers[currentRound]"
            avatar
            bordered
            overlap
            left
            offset-x="20"
            offset-y="20"
            :key="answer.length"
          >
            <template v-slot:badge>
              <v-avatar color="primary">
                <span v-if="user.name">
                  {{
                    user.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                  }}
                </span>
              </v-avatar>
            </template>
            <v-badge
              :value="
                gameTimer <= roundDetails.rivalAnswerTime &&
                answer === roundDetails.rivalAnswer
              "
              avatar
              bordered
              overlap
              offset-x="20"
              offset-y="20"
            >
              <template v-slot:badge>
                <v-avatar color="primary">
                  <span v-if="rival.name">
                    {{
                      rival.name
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
                  (answerGiven || gameTimer <= 0) &&
                  answer === roundDetails.correctAnswer
                    ? 'success'
                    : 'primary'
                "
                :style="
                  answer.length < 23
                    ? 'width: 300px'
                    : answer.length < 30
                    ? 'width: 300px; font-size: 0.8em'
                    : answer.length < 35
                    ? 'width: 300px; font-size: 0.7em'
                    : 'width: 300px; font-size: 0.6em'
                "
                @click="!roundIsOver && gameTimer <= 100 && giveAnswer(answer)"
                transition="slide-x-transition"
                >{{ answer }}</v-btn
              >
            </v-badge>
          </v-badge>
        </v-flex>
      </transition-group>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Duel, Rival, RoundDetails, User } from "@/types";
import Vue from "vue";

export default Vue.extend({
  name: "RoundAnswers",
  props: {
    duel: {
      type: Object as () => Duel,
    },
    user: {
      type: Object as () => User,
    },
    rival: {
      type: Object as () => Rival,
    },
    gameTimer: {
      type: Number,
    },
    currentRound: {
      type: Number,
    },
    roundDetails: {
      type: Object as () => RoundDetails,
    },
    roundIsOver: {
      type: Boolean,
    },
    answerGiven: {
      type: Boolean,
    },
  },
  // props: [
  //   "roundDetails",
  //   "user",
  //   "duel",
  //   "rival",
  //   "currentRound",
  //   "gameTimer",
  //   "roundIsOver",
  //   "answerGiven",
  // ],
  data: () => ({
    //
  }),
  methods: {
    giveAnswer(songId: string) {
      this.$emit("eventname", songId);
    },
  },
  async mounted() {
    //
  },
  computed: {
    //
  },
  watch: {
    //
  },
});
</script>

<style>
/* TODO: learn animations, I'm just headbutting walls at this point */
.slide-move,
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.1s, transform 0.1s;
  /* transition: all 0.5s ease; */
}
.slide-enter,
.slide-leave-to {
  /* opacity: 0;
  transform: translateX(-30%); */
  transition: opacity 0.1s, transform 0.1s;
}
.slide-leave-active {
  position: absolute;
}

.v-btn {
  font-size: 1.2em;
}
</style>
