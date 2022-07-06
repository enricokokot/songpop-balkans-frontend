<template>
  <v-container fill-height justify-center>
    <v-col></v-col>
    <v-responsive width="80%">
      <v-col>
        <h1 class="text-center">Who do you want to play against?</h1>
        <v-container v-for="player in players" :key="player.id">
          <v-card elevation="2" outlined>
            <v-row class="ma-1">
              <v-col>
                <v-avatar color="primary" size="10vh">
                  <span class="white--text text-h5">{{
                    player.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                  }}</span>
                </v-avatar>
              </v-col>
              <v-col
                ><v-container fill-height>
                  <v-row>{{ player.name }}</v-row>
                  <v-row v-if="player.duelStartTime">
                    {{ player.duelStartTime }}</v-row
                  >
                </v-container>
              </v-col>
              <v-col
                ><v-container
                  fill-height
                  v-if="!(player.result[0] === 0 && player.result[1] === 0)"
                >
                  <div class="text-h3">
                    {{ player.result[0] }} - {{ player.result[1] }}
                  </div>
                </v-container></v-col
              >
              <v-col
                ><v-container fill-height>
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
                </v-container>
              </v-col>
            </v-row>
          </v-card>
        </v-container>
        <v-container fill-height justify-center>
          <v-btn x-large color="primary" @click="goBack()" block>BACK </v-btn>
        </v-container>
      </v-col>
    </v-responsive>
    <v-col></v-col>
  </v-container>
</template>

<script>
import store from "@/store";
import { Users, Duels } from "@/services";

export default {
  name: "PlayView",
  data: () => ({
    currentUser: 1,
    players: [],
    duelAgainst: {},
    allUserRivalries: [],
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
    async fetchAllPlayers() {
      const allPlayers = await Users.getAll();
      return allPlayers;
    },
    async fetchAllDuels() {
      const allDuels = await Duels.getAll(this.currentUser);
      return allDuels;
    },
    async fetchAllRivalries() {
      const allRivalries = await Users.getAllRivalries(this.currentUser);
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
    this.duelAgainst = store.duelAgainst;
    this.currentUser = store.currentUser;
    const currentUser = this.currentUser;
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
