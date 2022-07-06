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
import { Users, Playlists } from "@/services";

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
    async fetchUserCoins() {
      const coins = await Users.getCoins(this.currentUser);
      return coins;
    },
    async fetchAllUserPlaylists() {
      const usersPlaylists = await Users.getPlaylists(this.currentUser);
      return usersPlaylists;
    },
    async fetchAllPlaylists() {
      const playlists = await Playlists.getAll();
      return playlists;
    },
    async buyPlaylist(playlist) {
      const data = {
        playerId: this.currentUser,
        playlistTitle: playlist.title,
      };
      const response = await Playlists.buy(data);
      console.log(response);
      this.fetchData();
    },
    async fetchData() {
      this.currentUser = store.currentUser;
      this.coins = await this.fetchUserCoins();
      this.playlists = await this.fetchAllUserPlaylists();
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
