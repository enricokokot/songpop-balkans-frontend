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
      <v-flex class="pa-3" md12 sm12>
        <h1 class="text-center">Who do you want to play against?</h1>
      </v-flex>
      <v-flex
        v-for="player in players"
        :key="player.id"
        class="pa-3 d-flex justify-center"
      >
        <v-card width="350" height="250" outlined rounded>
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title class="text-h5 mb-1">
                {{ player.name }}
              </v-list-item-title>
              <v-list-item-subtitle v-if="player.duelStartTime">{{
                player.duelStartTime
              }}</v-list-item-subtitle>
              <v-list-item-subtitle v-else class="transparent--text"
                >never hours ago</v-list-item-subtitle
              >
            </v-list-item-content>

            <v-list-item-avatar left size="80" color="primary"
              ><span class="white--text text-h5">{{
                player.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
              }}</span></v-list-item-avatar
            >
          </v-list-item>

          <v-list-item
            class="text-h5 mb-1 text-center d-flex justify-center"
            v-if="!(player.result[0] === 0 && player.result[1] === 0)"
          >
            {{ player.result[0] }} - {{ player.result[1] }}
          </v-list-item>
          <v-list-item
            class="text-h5 mb-1 transparent--text d-flex justify-center"
            v-else
          >
            možel' 2?
          </v-list-item>

          <v-card-actions>
            <v-btn
              v-if="player.status === 'waiting'"
              x-large
              color="primary"
              @click="playADuel(player)"
              disabled
              block
              text
              >Their Turn</v-btn
            >
            <v-btn
              v-else
              x-large
              color="primary"
              @click="playADuel(player)"
              block
              text
              >{{ player.status }}</v-btn
            >
            <!-- <v-btn
            v-if="
                      player.status !== 'challenge' &&
                      player.status !== 'waiting'
                    "
              x-large
              color="error"
              @click="quitADuel(player.id)"
              block
              text
              >QUIT
            </v-btn> -->
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex md12 sm12 class="pa-2">
        <v-btn x-large color="primary" @click="goBack()" block>BACK </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import store from "@/store";
import { Auth, Users, Duels } from "@/services";

export default {
  name: "PlayView",
  data: () => ({
    userId: Auth.state.user.userId,
    players: [],
    duelAgainst: {},
    allUserRivalries: [],
    snackbar: false,
  }),
  methods: {
    playADuel(player) {
      store.duelAgainst = player;
      this.duelAgainst = player;
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
    transformAllPlayers(allPlayers, allDuels, currentUser, allUserRivalries) {
      const allPlayersTransformed = Users.transformAll(
        allPlayers,
        allDuels,
        currentUser,
        allUserRivalries
      );
      return allPlayersTransformed;
    },
  },
  async mounted() {
    this.snackbar = store.snackbar;
    setTimeout(() => (store.snackbar = false), 3000);
    this.duelAgainst = store.duelAgainst;
    const currentUser = this.userId;
    this.allUserRivalries = await this.fetchAllRivalries();
    const allUserRivalries = this.allUserRivalries;
    const allPlayers = await this.fetchAllPlayers();
    const allDuels = await this.fetchAllDuels();
    this.players = this.transformAllPlayers(
      allPlayers,
      allDuels,
      currentUser,
      allUserRivalries
    );
  },
  computed: {
    //
  },
};
</script>
