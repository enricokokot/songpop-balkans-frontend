<template>
  <v-container fill-height fluid>
    <v-row class="align-center justify-center">
      <v-col v-if="duelAgainst.status === 'reply'">
        <v-row class="align-center justify-center pa-2">
          <h1
            v-if="duelAgainst.name && duelAgainst.duel.playlist"
            class="text-center"
          >
            {{ duelAgainst.name.split(" ")[0] }} has challenged you in
            {{ duelAgainst.duel.playlist }}
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

<script lang="ts">
import Vue from "vue";
import store from "@/store";
import { Auth, Users, Playlists } from "@/services";
import { DuelAgainst } from "@/types";

export default Vue.extend({
  name: "PrepareForDuelView",
  data: () => ({
    duelAgainst: {} as DuelAgainst,
    playlists: [],
    userId: Auth.state.user.userId,
  }),
  methods: {
    goBack() {
      this.$router.back();
    },
    async fetchAllAvailablePlaylists() {
      const usersPlaylists = await Users.getPlaylists(this.userId);
      return usersPlaylists;
    },
    async generateAGame(playlistId: string) {
      const game = await Playlists.generateGame(playlistId);
      this.duelAgainst.duel.rounds = game.roundsData;
      this.duelAgainst.duel.playlist = game.playlistId;
      store.duelAgainst = this.duelAgainst;
      this.$router.replace("/game");
    },
    continueADuel() {
      this.$router.replace("/game");
    },
  },
  async mounted() {
    this.duelAgainst = store.duelAgainst;
    if (!Object.keys(this.duelAgainst.duel).length) {
      this.playlists = await this.fetchAllAvailablePlaylists();
    }
  },
  computed: {
    //
  },
});
</script>
