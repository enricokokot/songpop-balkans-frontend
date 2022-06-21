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
            >{{ playlist.title }} {{ playlist.price }}</v-btn
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
