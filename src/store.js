const path = "C:\\Users\\ekoko\\Downloads";

export default {
  players: [
    {
      id: 0,
      name: "Dino Merlić",
      result: "3-0",
      status: "reply",
      playlist: "folk",
      rounds: {
        0: {
          songs: ["Kiše jesenje", "Kap po kap", "Marija", "Ja sam budućnost"],
          correctAnswer: "Kap po kap",
          playerAnswer: "Marija",
          playerPointsEarned: 0,
          playerTimeAnswered: 3,
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
          playerAnswer: "Parni valjak",
          playerPointsEarned: 40,
          playerTimeAnswered: 4,
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
          playerAnswer: "Ja volim samo sebe",
          playerPointsEarned: 0,
          playerTimeAnswered: 2,
          audio: require("C:\\Users\\ekoko\\Downloads\\Prljavo_kazaliste_-_Previše_suza_u_mom_pivu.mp3"),
        },
      },
      yourScore: 0,
    },
    {
      id: 1,
      name: "Senka Miletić",
      result: "1-2",
      status: "duel",
    },
    {
      id: 2,
      name: "Fedja Sakić",
      result: "",
      status: "challenge",
    },
    {
      id: 3,
      name: "Milan Swarovski",
      result: "",
      status: "challenge",
    },
  ],
  duelAgainst: {},
  playlists: ["rock", "rap"],
};
