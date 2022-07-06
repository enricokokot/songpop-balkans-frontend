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
import moment from "moment";

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
      const playersResponse = await fetch("http://localhost:3000/user");
      const playersData = await playersResponse.json();
      return playersData;
    },
    async fetchAllDuels() {
      const duelsResponse = await fetch(
        `http://localhost:3000/duel/${this.currentUser}`
      );
      const duelsData = await duelsResponse.json();
      return duelsData;
    },
    async fetchAllUserRivalries() {
      const userRivalriesResponse = await fetch(
        `http://localhost:3000/user/${this.currentUser}/rivalry`
      );
      const userRivalriesData = await userRivalriesResponse.json();
      return userRivalriesData;
    },
  },
  async mounted() {
    this.currentUser = store.currentUser;
    const allPlayers = await this.fetchAllPlayers();
    const allDuels = await this.fetchAllDuels();
    this.allUserRivalries = await this.fetchAllUserRivalries();
    const {
      specificPlayerDuelsWhereHeIsTheChallenger,
      specificPlayerDuelsWhereHeIsBeingChallenged,
    } = allDuels;
    const ids1 = specificPlayerDuelsWhereHeIsTheChallenger.map(
      (duel) => duel.challengeTakerId
    );
    const ids2 = specificPlayerDuelsWhereHeIsBeingChallenged.map(
      (duel) => duel.challengerId
    );
    const ids3 = ids1.concat(ids2);
    const allPlayersFiltered = allPlayers.filter(
      (player) => !ids3.includes(player.id)
    );

    const everyPlayerOnThePage = specificPlayerDuelsWhereHeIsBeingChallenged
      .concat(specificPlayerDuelsWhereHeIsTheChallenger)
      .concat(allPlayersFiltered);
    const everyPlayerOnThePageModified = everyPlayerOnThePage
      .filter((player) => player.id !== this.currentUser)
      .map((player) => {
        if (player.rounds && player.challengeTakerId === this.currentUser) {
          const duelStartTime = player.time
            ? moment(player.time).fromNow()
            : "...";
          const idsSortedByOrder =
            this.currentUser > player.challengerId
              ? [player.challengerId, this.currentUser]
              : [this.currentUser, player.challengerId];
          const wantedRivalry = this.allUserRivalries.find(
            (rivalry) =>
              rivalry.playerOneId === idsSortedByOrder[0] &&
              rivalry.playerTwoId === idsSortedByOrder[1]
          );
          const result = wantedRivalry
            ? this.currentUser === wantedRivalry.playerOneId
              ? [wantedRivalry.playerOneScore, wantedRivalry.playerTwoScore]
              : [wantedRivalry.playerTwoScore, wantedRivalry.playerOneScore]
            : [0, 0];
          return {
            id: player.challengerId,
            name: allPlayers.find((user) => user.id === player.challengerId)
              .name,
            result: [player.playerTwoTotalScore, player.playerOneTotalScore],
            status: "reply",
            playlist: player.playlist,
            rounds: player.rounds,
            duelId: player.id,
            result,
            duelStartTime,
          };
        } else if (
          player.rounds &&
          player.challengeTakerId !== this.currentUser
        ) {
          const duelStartTime = player.time
            ? moment(player.time).fromNow()
            : "...";
          const idsSortedByOrder =
            this.currentUser > player.challengeTakerId
              ? [player.challengeTakerId, this.currentUser]
              : [this.currentUser, player.challengeTakerId];
          const wantedRivalry = this.allUserRivalries.find(
            (rivalry) =>
              rivalry.playerOneId === idsSortedByOrder[0] &&
              rivalry.playerTwoId === idsSortedByOrder[1]
          );
          const result = wantedRivalry
            ? this.currentUser === wantedRivalry.playerOneId
              ? [wantedRivalry.playerOneScore, wantedRivalry.playerTwoScore]
              : [wantedRivalry.playerTwoScore, wantedRivalry.playerOneScore]
            : [0, 0];
          return {
            id: player.challengeTakerId,
            name: allPlayers.find((user) => user.id === player.challengeTakerId)
              .name,
            result: [player.playerOneTotalScore, player.playerTwoTotalScore],
            status: "waiting",
            result,
            duelStartTime,
          };
        } else {
          const idsSortedByOrder =
            this.currentUser > player.id
              ? [player.id, this.currentUser]
              : [this.currentUser, player.id];
          const wantedRivalry = this.allUserRivalries.find(
            (rivalry) =>
              rivalry.playerOneId === idsSortedByOrder[0] &&
              rivalry.playerTwoId === idsSortedByOrder[1]
          );
          const result = wantedRivalry
            ? this.currentUser === wantedRivalry.playerOneId
              ? [wantedRivalry.playerOneScore, wantedRivalry.playerTwoScore]
              : [wantedRivalry.playerTwoScore, wantedRivalry.playerOneScore]
            : [0, 0];
          return {
            id: player.id,
            name: player.name,
            result: [0, 0],
            status: "challenge",
            result,
          };
        }
      });
    this.players = everyPlayerOnThePageModified;
    this.duelAgainst = store.duelAgainst;
  },
  computed: {
    //
  },
};
</script>
