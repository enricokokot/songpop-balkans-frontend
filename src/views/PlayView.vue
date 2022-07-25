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
      <v-flex xs12>
        <v-layout justify-center xs12>
          <v-flex xs12 style="max-width: 450px">
            <v-text-field
              single-line
              v-model="input"
              @input="filter"
              class="px-6 centered-input"
              ><template v-slot:label>
                <v-icon> mdi-magnify </v-icon>
              </template></v-text-field
            >
          </v-flex>
        </v-layout>
      </v-flex>
      <!-- <v-fade-transition group leave-absolute> -->
      <v-flex
        v-for="player in players"
        :key="player.id"
        class="pa-3 d-flex justify-center"
      >
        <PlayerCard :player="player" @eventname="playADuel" />
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

<script lang="ts">
import Vue from "vue";
import store from "@/store";
import { Auth, Users, Duels } from "@/services";
import PlayerCard from "@/components/PlayerCard.vue";
import { Duel, DuelAgainst, Player, PlayerRaw, Rivalry } from "@/types";

export default Vue.extend({
  name: "PlayView",
  components: { PlayerCard },
  data: () => ({
    userId: Auth.state.user.userId,
    players: [] as Player[],
    allUserRivalries: [],
    snackbar: false,
    page: 1,
    pageNumber: 1,
    input: "",
  }),
  methods: {
    async filter() {
      this.page = 1;
      const { results, pageNumber } = await this.fetchOrdered();
      this.pageNumber = pageNumber;
      this.players = await this.preparePlayers(results);
    },
    async changePage(page: number) {
      const { results, pageNumber } = await this.fetchOrdered();
      this.pageNumber = pageNumber;
      this.players = await this.preparePlayers(results);
      window.scrollTo(0, 0);
    },
    playADuel(player: DuelAgainst) {
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
    async fetchOrdered() {
      const users = await Users.getOrdered(
        this.userId,
        this.page - 1,
        this.input
      );
      return users;
    },
    async preparePlayers(players: PlayerRaw[]) {
      const allRivalries = await this.fetchAllRivalries();
      const allDuelsSeparated = await this.fetchAllDuels();
      const {
        specificPlayerDuelsWhereHeIsBeingChallenged,
        specificPlayerDuelsWhereHeIsTheChallenger,
      } = allDuelsSeparated;
      const allDuels = specificPlayerDuelsWhereHeIsBeingChallenged.concat(
        specificPlayerDuelsWhereHeIsTheChallenger
      );
      return players.map((player: PlayerRaw) => {
        const sortedIds =
          this.userId < player._id
            ? [this.userId, player._id]
            : [player._id, this.userId];
        const rivalry = allRivalries.find(
          (rivalry: Rivalry) =>
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

        const achivementText =
          player.appendedAchievement < 0
            ? ""
            : player.achievements[player.appendedAchievement].mission;

        if (player.waiting.includes(this.userId)) {
          const gottenDuel = allDuels.find(
            (duel: Duel) => duel.challengerId == player._id
          );
          const duel =
            typeof gottenDuel.playlist !== "string"
              ? { ...gottenDuel, playlist: gottenDuel.playlist.title }
              : gottenDuel.playlist.title;
          return {
            id: player._id,
            name: player.username,
            duel,
            score,
            status: "reply",
            appendedAchievement: {
              id: player.appendedAchievement,
              text: achivementText,
            },
          };
        } else if (player.reply.includes(this.userId)) {
          const gottenDuel = allDuels.find(
            (duel: Duel) => duel.challengeTakerId == player._id
          );
          const duel =
            typeof gottenDuel.playlist !== "string"
              ? { ...gottenDuel, playlist: gottenDuel.playlist.title }
              : gottenDuel.playlist.title;
          return {
            id: player._id,
            name: player.username,
            duel,
            score,
            status: "waiting",
            appendedAchievement: {
              id: player.appendedAchievement,
              text: achivementText,
            },
          };
        } else {
          return {
            id: player._id,
            name: player.username,
            duel: {},
            score,
            status: "challenge",
            appendedAchievement: {
              id: player.appendedAchievement,
              text: achivementText,
            },
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
    const { results, pageNumber } = await this.fetchOrdered();
    this.pageNumber = pageNumber;
    this.players = await this.preparePlayers(results);
  },
  computed: {
    //
  },
});
</script>

<style>
html {
  scroll-behavior: smooth;
}

.centered-input input {
  text-align: center;
}
</style>
