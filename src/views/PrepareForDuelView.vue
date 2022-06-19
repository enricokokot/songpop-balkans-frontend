<template>
  <v-container fill-height justify-center>
    <v-container
      v-if="duelAgainst.status === 'reply'"
      fill-height
      justify-center
    >
      <h1 v-if="duelAgainst.name">
        {{ duelAgainst.name.split(" ")[0] }} has challenged you in
        {{ duelAgainst.playlist }}
      </h1>
      <v-btn x-large color="primary">ACCEPT</v-btn>
      <v-btn x-large color="primary">BACK</v-btn>
    </v-container>
    <v-container v-else fill-height justify-center>
      <h1 v-if="duelAgainst.name">
        What do you want to duel {{ duelAgainst.name.split(" ")[0] }} in?
      </h1>
      <v-btn
        v-for="playlist in playlists"
        :key="playlist"
        x-large
        color="primary"
        >{{ playlist }}</v-btn
      >
      <v-btn x-large color="primary">BACK</v-btn>
    </v-container>
  </v-container>
</template>

<script>
import store from "@/store";

export default {
  name: "PrepareForDuelView",
  data: () => ({
    duelAgainst: {},
    playlists: [],
  }),
  methods: {
    //
  },
  mounted() {
    this.duelAgainst = store.duelAgainst;
    this.playlists = store.playlists;
  },
  computed: {
    //
  },
};
</script>
