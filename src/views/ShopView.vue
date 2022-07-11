<template>
  <v-container fluid>
    <v-layout row class="align-center justify-center">
      <v-flex class="text-center pa-3" xs12>
        <h1>This is the shop page</h1>
      </v-flex>
      <v-flex class="text-center pa-3" xs12>
        <h3>{{ coins }} coins available, choose a playlist</h3>
      </v-flex>
      <v-flex class="text-center pa-3" xs12>
        <transition-group name="slide-fade" mode="out-in">
          <div v-for="playlist in allPlaylists" :key="playlist.title">
            <transition name="slide-fade" mode="out-in">
              <v-btn
                v-if="!playlists.includes(playlist.title)"
                x-large
                :key="playlist.title"
                class="ma-2"
                color="primary"
                @click="buyPlaylist(playlist)"
                width="300"
                :disabled="playlist.songs.length < 12"
                ><v-col class="d-flex justify-start">{{
                  playlist.title
                }}</v-col>
                <v-col class="d-flex justify-end">{{
                  playlist.price
                }}</v-col></v-btn
              >
            </transition>
          </div>
        </transition-group>
      </v-flex>
      <v-flex class="text-center pa-3" xs12>
        <v-btn x-large color="primary" @click="goBack()" width="300"
          >BACK
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import store from "@/store";
import { Auth, Users, Playlists } from "@/services";

export default {
  name: "ShopView",
  data: () => ({
    userId: Auth.state.user.userId,
    coins: 0,
    playlists: [],
    allPlaylists: [],
  }),
  methods: {
    goBack() {
      this.$router.back();
    },
    async fetchUserCoins() {
      const coins = await Users.getCoins(this.userId);
      return coins;
    },
    async fetchAllUserPlaylists() {
      const usersPlaylists = await Users.getPlaylists(this.userId);
      return usersPlaylists;
    },
    async fetchAllPlaylists() {
      const playlists = await Playlists.getAll();
      return playlists;
    },
    async buyPlaylist(playlist) {
      const data = {
        playerId: this.userId,
        playlistTitle: playlist.title,
      };
      const response = await Playlists.buy(data);
      console.log(response);
      this.fetchData();
    },
    async fetchData() {
      this.coins = await this.fetchUserCoins();
      this.playlists = await this.fetchAllUserPlaylists();
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

<style>
.slide-fade-enter-active {
  transition: all 1s ease;
}
.slide-fade-leave-active {
  transition: all 1s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for <2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
