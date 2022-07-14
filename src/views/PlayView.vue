<template>
  <v-container justify-center>
    <v-snackbar v-model="snackbar" :multi-line="true">
      Sorry, you've been redirected because of an unforseeable error...
      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-layout row wrap>
      <v-flex class="pa-3" xs12>
        <h1 class="text-center">Who do you want to play against?</h1>
      </v-flex>
      <!-- <v-fade-transition group leave-absolute> -->
      <v-flex
        v-for="player in players"
        :key="player.id"
        class="pa-3 d-flex justify-center"
      >
        <PlayerCard :player="player" @eventname="playADuel" :key="player.id" />
      </v-flex>
      <!-- </v-fade-transition> -->
      <v-flex xs12 class="pa-2">
        <v-pagination
          v-if="pageNumber > 1"
          @input="changePage(page)"
          v-model="page"
          :length="pageNumber"
        ></v-pagination>
      </v-flex>
      <v-flex xs12 class="pa-2 text-center">
        <v-btn x-large color="primary" @click="goBack()" style="width: 300px"
          >BACK
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import store from "@/store";
import { Auth, Users, Duels } from "@/services";
import PlayerCard from "@/components/PlayerCard";

export default {
  name: "PlayView",
  components: { PlayerCard },
  data: () => ({
    userId: Auth.state.user.userId,
    players: [],
    allUserRivalries: [],
    snackbar: false,
    page: 1,
    pageNumber: 1,
  }),
  methods: {
    async changePage(page) {
      const { results, pageNumber } = await this.fetchOrdered(page);
      this.pageNumber = pageNumber;
      this.players = await this.preparePlayers(results);
      window.scrollTo(0, 0);
    },
    playADuel(player) {
      store.duelAgainst = player;
      this.$router.push("/duel/start");
    },
    // quitADuel(playerId) {
    //   const playerBeingQuit = store.players.find(
    //     (player) => player.id === playerId
    //   );
    //   playerBeingQuit.status = "challenge";
    // },
    goBack() {
      this.$router.push("/home");
    },
    async fetchUser() {
      const player = await Users.getOne(this.userId);
      return player;
    },
    async fetchOrdered(page) {
      const users = await Users.getOrdered(this.userId, page - 1);
      return users;
    },
    async preparePlayers(players) {
      const allRivalries = await this.fetchAllRivalries();
      const allDuelsSeparated = await this.fetchAllDuels();
      const {
        specificPlayerDuelsWhereHeIsBeingChallenged,
        specificPlayerDuelsWhereHeIsTheChallenger,
      } = allDuelsSeparated;
      const allDuels = specificPlayerDuelsWhereHeIsBeingChallenged.concat(
        specificPlayerDuelsWhereHeIsTheChallenger
      );
      return players.map((player) => {
        const sortedIds =
          this.userId < player._id
            ? [this.userId, player._id]
            : [player._id, this.userId];

        const rivalry = allRivalries.find(
          (rivalry) =>
            sortedIds[0] === rivalry.playerOneId &&
            sortedIds[1] === rivalry.playerTwoId
        );
        const score = [0, 0];
        if (rivalry) {
          if (this.userId === rivalry.playerOneId) {
            score[0] = rivalry.playerOneScore;
            score[1] = rivalry.playerTwoScore;
          } else {
            score[0] = rivalry.playerTwoScore;
            score[1] = rivalry.playerOneScore;
          }
        }

        if (player.waiting.includes(this.userId)) {
          const duel = allDuels.find((duel) => duel.challengerId == player._id);
          return {
            id: player._id,
            name: player.username,
            duel,
            score,
            status: "reply",
          };
        } else if (player.reply.includes(this.userId)) {
          const duel = allDuels.find(
            (duel) => duel.challengeTakerId == player._id
          );
          return {
            id: player._id,
            name: player.username,
            duel,
            score,
            status: "waiting",
          };
        } else {
          return {
            id: player._id,
            name: player.username,
            duel: {},
            score,
            status: "challenge",
          };
        }
      });
    },
    async fetchAllPlayers() {
      const allPlayers = await Users.getAll();
      return allPlayers;
    },
    async fetchAllDuels() {
      const allDuels = await Duels.getAll(this.userId);
      return allDuels;
    },
    async fetchAllRivalries() {
      const allRivalries = await Users.getAllRivalries(this.userId);
      return allRivalries;
    },
  },
  async mounted() {
    this.snackbar = store.snackbar;
    setTimeout(() => (store.snackbar = false), 3000);
    this.user = await this.fetchUser();
    const { results, pageNumber } = await this.fetchOrdered(1);
    this.pageNumber = pageNumber;
    this.players = await this.preparePlayers(results);
  },
  computed: {
    //
  },
};
</script>

<style>
html {
  scroll-behavior: smooth;
}
</style>
