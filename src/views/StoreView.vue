<template>
  <v-container fill-height justify-center>
    <h1>This is the store page</h1>
    <h3>
      You are holding {{ coins }} coins, ready to be spent, in your pocket...
      What playlist would you like to spend 'em on?'
    </h3>
    <div v-for="playlist in allPlaylists" :key="playlist.title">
      <v-btn
        v-if="!playlists.includes(playlist.title)"
        x-large
        color="primary"
        @click="buyPlaylist(playlist)"
        >{{ playlist.title }} {{ playlist.price }}</v-btn
      >
    </div>
    <v-btn x-large color="primary" @click="goBack()">BACK </v-btn>
  </v-container>
</template>

<script>
import store from "@/store";

export default {
  name: "StoreView",
  data: () => ({
    coins: 0,
    playlists: [],
    allPlaylists: [],
  }),
  methods: {
    goBack() {
      this.$router.back();
    },
    buyPlaylist(playlist) {
      if (store.coins >= playlist.price) {
        store.coins -= playlist.price;
        store.playlists.push(playlist.title);
        this.fetchData();
      }
    },
    fetchData() {
      this.coins = store.coins;
      this.playlists = store.playlists;
      this.allPlaylists = store.allPlaylists;
    },
  },
  mounted() {
    this.fetchData();
  },
  computed: {
    //
  },
};
</script>
