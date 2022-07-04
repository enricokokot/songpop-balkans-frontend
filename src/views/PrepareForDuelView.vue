<template>
  <v-container fill-height fluid>
    <v-row class="align-center justify-center">
      <v-col v-if="duelAgainst.status === 'reply'">
        <v-row class="align-center justify-center pa-2">
          <h1 v-if="duelAgainst.name" class="text-center">
            {{ duelAgainst.name.split(" ")[0] }} has challenged you in
            {{ duelAgainst.playlist.title }}
          </h1>
        </v-row>
        <v-row class="align-center justify-center"
          ><v-btn
            x-large
            class="ma-2"
            color="primary"
            @click="continueADuel()"
            width="40%"
            >ACCEPT</v-btn
          ></v-row
        >
        <v-row class="align-center justify-center"
          ><v-btn x-large color="primary mt-8" @click="goBack()" width="40%"
            >BACK</v-btn
          ></v-row
        >
      </v-col>

      <v-col v-else>
        <v-row class="align-center justify-center pa-2">
          <h1 v-if="duelAgainst.name" class="text-center">
            What do you want to duel {{ duelAgainst.name.split(" ")[0] }} in?
          </h1>
        </v-row>
        <v-row
          v-for="playlist in playlists"
          :key="playlist"
          class="align-center justify-center"
          ><v-btn
            x-large
            class="ma-2"
            color="primary"
            @click="generateAGame(playlist)"
            width="40%"
            >{{ playlist }}</v-btn
          ></v-row
        >
        <v-row class="align-center justify-center"
          ><v-btn
            x-large
            class="mt-8"
            color="primary"
            @click="goBack()"
            width="40%"
            >BACK</v-btn
          ></v-row
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import store from "@/store";

export default {
  name: "PrepareForDuelView",
  data: () => ({
    currentUser: 1,
    duelAgainst: {},
    playlists: [],
  }),
  methods: {
    goBack() {
      this.$router.back();
    },
    async fetchAPlaylist(playlistId) {
      const playlistResponse = await fetch(
        `http://localhost:3000/playlist/${playlistId}`
      );
      const playlistData = await playlistResponse.json();
      return playlistData;
    },
    async fetchAllAvailablePlaylists(userId) {
      const userPlaylistResponse = await fetch(
        `http://localhost:3000/user/${userId}/playlist`
      );
      const userPlaylistData = await userPlaylistResponse.json();
      return userPlaylistData;
    },
    async generateAGame(playlistId) {
      const generateGameResponse = await fetch(
        `http://localhost:3000/game/${playlistId}`
      );
      const generateGameData = await generateGameResponse.json();
      this.duelAgainst.rounds = generateGameData.roundsData;
      this.duelAgainst.playlist = generateGameData.playlistId;
      store.duelAgainst = this.duelAgainst;
      this.$router.replace("/game");
    },
    continueADuel() {
      this.$router.replace("/game");
    },
  },
  async mounted() {
    this.currentUser = store.currentUser;
    this.duelAgainst = store.duelAgainst;
    if (this.duelAgainst.playlist || this.duelAgainst.playlist === 0) {
      this.duelAgainst.playlist = await this.fetchAPlaylist(
        this.duelAgainst.playlist
      );
    } else {
      this.playlists = await this.fetchAllAvailablePlaylists(this.currentUser);
      store.playlists = this.playlists;
    }
  },
  computed: {
    //
  },
};
</script>
