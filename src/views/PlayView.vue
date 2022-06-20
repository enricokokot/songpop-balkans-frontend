<template>
  <v-container justify-center>
    <h1>Choose a person to duel against</h1>
    <v-container v-for="player in players" :key="player.id">
      <v-card elevation="2" outlined>
        <v-card-title>{{ player.name }}</v-card-title>
        <v-card-subtitle v-if="player.result[0] !== 0 && player.result[1] !== 0"
          >{{ player.result[0] }} - {{ player.result[1] }}</v-card-subtitle
        >
        <v-card-text></v-card-text>
        <v-card-actions
          ><v-btn
            v-if="player.status === 'waiting'"
            x-large
            color="primary"
            @click="playADuel(player)"
            disabled
            >{{ player.status }}</v-btn
          ><v-btn v-else x-large color="primary" @click="playADuel(player)">{{
            player.status
          }}</v-btn
          ><v-btn
            v-if="player.status !== 'challenge' && player.status !== 'waiting'"
            x-large
            color="error"
            @click="quitADuel(player.id)"
            >QUIT
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
    <v-container justify-center>
      <v-btn x-large color="primary" @click="goBack()">BACK </v-btn>
    </v-container>
  </v-container>
</template>

<script>
import store from "@/store";

export default {
  name: "PlayView",
  data: () => ({
    players: [],
    duelAgainst: {},
  }),
  methods: {
    playADuel(player) {
      store.duelAgainst = player;
      this.duelAgainst = player;
      this.$router.push("/duel/start");
    },
    quitADuel(playerId) {
      const playerBeingQuit = store.players.find(
        (player) => player.id === playerId
      );
      playerBeingQuit.status = "challenge";
    },
    goBack() {
      this.$router.push("/");
    },
  },
  mounted() {
    this.players = store.players;
    this.duelAgainst = store.duelAgainst;
  },
  computed: {
    //
  },
};
</script>
