<template>
  <v-container fill-height fluid>
    <v-row class="align-center justify-center">
      <v-col>
        <v-row class="align-center justify-center pa-2">
          <h1>This is the store page</h1>
        </v-row>
        <v-row class="align-center justify-center pa-2">
          <h3 class="text-center">
            You are holding {{ coins }} coins, ready to be spent, in your
            pocket...<br />
            What playlist would you like to spend 'em on?'
          </h3>
        </v-row>
        <v-row
          v-for="playlist in allPlaylists"
          :key="playlist.title"
          class="align-center justify-center"
        >
          <v-btn
            v-if="!playlists.includes(playlist.title)"
            x-large
            class="ma-2"
            color="primary"
            @click="buyPlaylist(playlist)"
            width="30%"
            ><v-col class="d-flex justify-start">{{ playlist.title }}</v-col>
            <v-col class="d-flex justify-end">{{
              playlist.price
            }}</v-col></v-btn
          >
        </v-row>
        <v-row class="align-center justify-center mt-8">
          <v-btn x-large color="primary" @click="goBack()" width="30%"
            >BACK
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import store from "@/store";

export default {
  name: "StoreView",
  data: () => ({
    currentUser: 1,
    coins: 0,
    playlists: [],
    allPlaylists: [],
  }),
  methods: {
    goBack() {
      this.$router.back();
    },
    async fetchUserCoins(userId) {
      const CoinResponse = await fetch(
        `http://localhost:3000/user/${userId}/coin`
      );
      const userCoinData = await CoinResponse.json();
      return userCoinData.availableCoins;
    },
    async fetchAllAvailablePlaylists(userId) {
      const userPlaylistResponse = await fetch(
        `http://localhost:3000/user/${userId}/playlist`
      );
      const userPlaylistData = await userPlaylistResponse.json();
      return userPlaylistData;
    },
    async fetchAllPlaylists() {
      const playlistResponse = await fetch(`http://localhost:3000/playlist`);
      const playlistData = await playlistResponse.json();
      return playlistData;
    },
    async buyPlaylist(playlist) {
      const transactionResult = await fetch(
        `http://localhost:3000/shop/playlist`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerId: this.currentUser,
            playlistTitle: playlist.title,
          }),
        }
      );
      const transactionResultData = await transactionResult.json();
      console.log(transactionResultData);
      this.fetchData();
    },
    async fetchData() {
      this.currentUser = store.currentUser;
      this.coins = await this.fetchUserCoins(this.currentUser);
      this.playlists = await this.fetchAllAvailablePlaylists(this.currentUser);
      store.playlists = this.playlists;
      this.allPlaylists = await this.fetchAllPlaylists();
    },
  },
  async mounted() {
    this.fetchData();
  },
  computed: {
    //
  },
};
</script>
