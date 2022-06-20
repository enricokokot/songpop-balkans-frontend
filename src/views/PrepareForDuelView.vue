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
      <v-btn x-large color="primary" @click="duel(duelAgainst.playlist)"
        >ACCEPT</v-btn
      >
      <v-btn x-large color="primary" @click="goBack()">BACK</v-btn>
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
        @click="duel(playlist)"
        >{{ playlist }}</v-btn
      >
      <v-btn x-large color="primary" @click="goBack()">BACK</v-btn>
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
    goBack() {
      this.$router.back();
    },
    duel(playlistName) {
      const duelingPlayer = store.players.find(
        (player) => player.id === this.duelAgainst.id
      );
      if (playlistName === "folk") {
        duelingPlayer.playlist = playlistName;
        duelingPlayer.rounds = {
          0: {
            songs: ["Mali signali", "Bele ruže", "Ponovo", "Aspirin"],
            correctAnswer: "Aspirin",
            playerPointsEarned: 0,
            audio: require("C:\\Users\\ekoko\\Downloads\\Seka_-_Aspirin.mp3"),
          },
          1: {
            songs: ["Mile Kitić", "Đani", "Olja Karleuša", "Miligram 3"],
            correctAnswer: "Mile Kitić",
            playerPointsEarned: 0,
            audio: require("C:\\Users\\ekoko\\Downloads\\Mile_Kitić_-_Šampanjac.mp3"),
          },
          2: {
            songs: ["Đani", "Djogani", "Trik FX", "Sinan Sakić"],
            correctAnswer: "Sinan Sakić",
            playerPointsEarned: 0,
            audio: require("C:\\Users\\ekoko\\Downloads\\Sinan_Sakić_-_Trezan.mp3"),
          },
        };
      }
      if (playlistName === "rap") {
        duelingPlayer.playlist = playlistName;
        duelingPlayer.rounds = {
          0: {
            songs: ["Vojko V", "Edo Maajka", "The Beat Fleet", "Ajs Nigrutin"],
            correctAnswer: "Vojko V",
            playerPointsEarned: 0,
            audio: require("C:\\Users\\ekoko\\Downloads\\Vojko_V_-_Ne_može.mp3"),
          },
          1: {
            songs: [
              "Ljuti načos",
              "Esi mi dobar",
              "Kinezi tranvestiti",
              "Lovrinac",
            ],
            correctAnswer: "Esi mi dobar",
            playerPointsEarned: 0,
            audio: require("C:\\Users\\ekoko\\Downloads\\Bad_Copy_-_Esi_mi_dobar.mp3"),
          },
          2: {
            songs: ["Vojko V", "The Beat Fleet", "Stoka", "Nered"],
            correctAnswer: "The Beat Fleet",
            playerPointsEarned: 0,
            audio: require("C:\\Users\\ekoko\\Downloads\\The_Beat_Fleet_-_Malo_san_maka.mp3"),
          },
        };
      }
      if (playlistName === "rock" && this.duelAgainst.name !== "Dino Merlić") {
        duelingPlayer.playlist = playlistName;
        duelingPlayer.rounds = {
          0: {
            songs: ["Kiše jesenje", "Kap po kap", "Marija", "Ja sam budućnost"],
            correctAnswer: "Kap po kap",
            playerPointsEarned: 0,
            audio: require("C:\\Users\\ekoko\\Downloads\\Divlje_jagode_-_Kap_po_kap.mp3"),
          },
          1: {
            songs: [
              "Vatra",
              "Divlje jagode",
              "Parni valjak",
              "Bajaga i Instruktori",
            ],
            correctAnswer: "Parni valjak",
            playerPointsEarned: 0,
            audio: require("C:\\Users\\ekoko\\Downloads\\Parni_valjak_-_Sve_još_miriše_na_nju.mp3"),
          },
          2: {
            songs: [
              "Ne zovi mama doktora",
              "Ja volim samo sebe",
              "Previše suza u mom pivu",
              "Teške boje",
            ],
            correctAnswer: "Previše suza u mom pivu",
            playerPointsEarned: 0,
            audio: require("C:\\Users\\ekoko\\Downloads\\Prljavo_kazaliste_-_Previše_suza_u_mom_pivu.mp3"),
          },
        };
      }
      this.$router.replace("/game");
    },
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
