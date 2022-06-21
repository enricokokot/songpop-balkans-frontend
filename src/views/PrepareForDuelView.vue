<template>
  <v-container fill-height fluid>
    <v-row class="align-center justify-center">
      <v-col v-if="duelAgainst.status === 'reply'">
        <v-row class="align-center justify-center pa-2">
          <h1 v-if="duelAgainst.name" class="text-center">
            {{ duelAgainst.name.split(" ")[0] }} has challenged you in
            {{ duelAgainst.playlist }}
          </h1>
        </v-row>
        <v-row class="align-center justify-center"
          ><v-btn
            x-large
            class="ma-2"
            color="primary"
            @click="duel(duelAgainst.playlist)"
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
            @click="duel(playlist)"
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
      if (playlistName === "Folk") {
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
      if (playlistName === "Istarski Mix") {
        duelingPlayer.playlist = playlistName;
        duelingPlayer.rounds = {
          0: {
            songs: [
              "Šparoga bluz",
              "Cice i guzice",
              "Rege na brege",
              "Katarina",
            ],
            correctAnswer: "Cice i guzice",
            playerPointsEarned: 0,
            audio: require("./..\\assets\\clips\\Šajeta_-_Cice_i_guzice-cut.mp3"),
          },
          1: {
            songs: ["Katarina", "Sandra", "Seksuvalna", "Nisi više mala"],
            correctAnswer: "Nisi više mala",
            playerPointsEarned: 0,
            audio: require("./..\\assets\\clips\\Alen_Vitasović_-_Nisi_više_mala-cut.mp3"),
          },
          2: {
            songs: [
              "Gustafi",
              "The Night Express Band",
              "Serđo Valić",
              "Koktelsi",
            ],
            correctAnswer: "Koktelsi",
            playerPointsEarned: 0,
            audio: require("./..\\assets\\clips\\Koktelsi_-_Malice-cut.mp3"),
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
      if (playlistName === "Rap") {
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
      if (playlistName === "Rock" && this.duelAgainst.name !== "Dino Merlić") {
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
