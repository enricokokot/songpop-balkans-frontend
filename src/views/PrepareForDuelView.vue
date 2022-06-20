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
            audio: require("./..\\assets\\clips\\Seka_-_Aspirin-cut.mp3"),
          },
          1: {
            songs: ["Mile Kitić", "Đani", "Olja Karleuša", "Miligram 3"],
            correctAnswer: "Mile Kitić",
            playerPointsEarned: 0,
            audio: require("./..\\assets\\clips\\Mile_Kitić_-_Šampanjac-cut.mp3"),
          },
          2: {
            songs: ["Đani", "Djogani", "Trik FX", "Sinan Sakić"],
            correctAnswer: "Sinan Sakić",
            playerPointsEarned: 0,
            audio: require("./..\\assets\\clips\\Sinan_Sakić_-_Trezan-cut.mp3"),
          },
        };
      }
      if (playlistName === "Jura Stublić") {
        duelingPlayer.playlist = playlistName;
        duelingPlayer.rounds = {
          0: {
            songs: [
              "Dobre vibracije",
              "Chicago",
              "Ljubav je zakon",
              "Srce na cesti",
            ],
            correctAnswer: "Chicago",
            playerPointsEarned: 0,
            audio: require("./..\\assets\\clips\\Jura_Stublić_i_Film_-_Chicago-cut.mp3"),
          },
          1: {
            songs: [
              "Ana Nirvana",
              "Srce na cesti",
              "Lijepo, lijepo neopisivo",
              "Sjećam se prvog poljupca",
            ],
            correctAnswer: "Sjećam se prvog poljupca",
            playerPointsEarned: 0,
            audio: require("./..\\assets\\clips\\Jura_Stublić_i_Film_-_Sjećam_se_prvog_poljupca-cut.mp3"),
          },
          2: {
            songs: [
              "Moderna djevojka",
              "Ana Nirvana",
              "Nježno, nježno, nježnije",
              "Doći ću ti u snovima",
            ],
            correctAnswer: "Doći ću ti u snovima",
            playerPointsEarned: 0,
            audio: require("./..\\assets\\clips\\Jura_Stublić_i_Film_-_Doći_ću_ti_u_snovima-cut.mp3"),
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
            audio: require("./..\\assets\\clips\\Vojko_V_-_Ne_može-cut.mp3"),
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
            audio: require("./..\\assets\\clips\\Bad_Copy_-_Esi_mi_dobar-cut.mp3"),
          },
          2: {
            songs: ["Vojko V", "The Beat Fleet", "Stoka", "Nered"],
            correctAnswer: "The Beat Fleet",
            playerPointsEarned: 0,
            audio: require("./..\\assets\\clips\\The_Beat_Fleet_-_Malo_san_maka-cut.mp3"),
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
            audio: require("./..\\assets\\clips\\Divlje_jagode_-_Kap_po_kap-cut.mp3"),
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
            audio: require("./..\\assets\\clips\\Parni_valjak_-_Sve_još_miriše_na_nju-cut.mp3"),
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
            audio: require("./..\\assets\\clips\\Prljavo_kazaliste_-_Previše_suza_u_mom_pivu-cut.mp3"),
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
