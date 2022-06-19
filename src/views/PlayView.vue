<template>
  <v-container justify-center>
    <h1>Choose a person to duel against</h1>
    <v-container v-for="player in players" :key="player.id">
      <v-card elevation="2" outlined>
        <v-card-title>{{ player.name }}</v-card-title>
        <v-card-subtitle>{{ player.result }}</v-card-subtitle>
        <v-card-text></v-card-text>
        <v-card-actions
          ><v-btn x-large color="primary" @click="playADuel(player)">{{
            player.status
          }}</v-btn></v-card-actions
        >
      </v-card>
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
