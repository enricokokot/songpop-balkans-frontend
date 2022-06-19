<template>
  <v-container justify-center>
    <h1>Choose a person to duel against</h1>
    <v-container v-for="player in players" :key="player.id">
      <v-card elevation="2" outlined>
        <v-card-title>{{ player.name }}</v-card-title>
        <v-card-subtitle>{{ player.result }}</v-card-subtitle>
        <v-card-text></v-card-text>
        <v-card-actions
          ><v-btn x-large color="primary" @click="playADuel()">{{
            player.status
          }}</v-btn></v-card-actions
        >
      </v-card>
    </v-container>
  </v-container>
</template>

<script>
export default {
  name: "PlayView",
  data: () => ({
    players: [
      {
        id: 0,
        name: "Dino Merlić",
        result: "3-0",
        status: "reply",
      },
      {
        id: 1,
        name: "Senka Miletić",
        result: "1-2",
        status: "duel",
      },
      {
        id: 2,
        name: "Fedja Sakić",
        result: "",
        status: "challenge",
      },
      {
        id: 3,
        name: "Milan Swarovski",
        result: "",
        status: "challenge",
      },
    ],
  }),
  methods: {
    playADuel() {
      this.$router.push("/duel/start");
    },
  },
  mounted() {
    //
  },
  computed: {
    //
  },
};
</script>
