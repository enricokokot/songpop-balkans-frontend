export default {
  players: [
    {
      id: 0,
      name: "Dino Merlić",
      result: [3, 1],
      status: "reply",
      playlist: "Rock",
      rounds: {
        0: {
          songs: ["Kiše jesenje", "Kap po kap", "Marija", "Ja sam budućnost"],
          correctAnswer: "Kap po kap",
          playerAnswer: "Marija",
          playerPointsEarned: 0,
          playerTimeAnswered: 3,
          audio: require("./assets/clips/Divlje_jagode_-_Kap_po_kap-cut.mp3"),
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
          audio: require("./assets/clips/Parni_valjak_-_Sve_još_miriše_na_nju-cut.mp3"),
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
          audio: require("./assets/clips/Prljavo_kazaliste_-_Previše_suza_u_mom_pivu-cut.mp3"),
        },
      },
      yourScore: 0,
    },
    {
      id: 1,
      name: "Senka Miletić",
      result: [1, 2],
      status: "duel",
    },
    {
      id: 2,
      name: "Fedja Sakić",
      result: [0, 0],
      status: "challenge",
    },
    {
      id: 3,
      name: "Milan Swarovski",
      result: [0, 0],
      status: "challenge",
    },
  ],
  duelAgainst: {},
  playlists: ["Folk", "Rock"],
  allPlaylists: [
    { title: "Folk", price: 20 },
    { title: "Jura Stublić", price: 20 },
    { title: "Rock", price: 25 },
    { title: "Rap", price: 20 },
    { title: "Istarski Mix", price: 20 },
  ],
  coins: 25,
  achievements: [
    { id: 0, mission: "Win 10 games", progress: 1, total: 10 },
    {
      id: 1,
      mission: "Win a match agains 3 different people",
      progress: 3,
      total: 3,
    },
    {
      id: 2,
      mission: "Win with 5 different playlists",
      progress: 2,
      total: 5,
    },
    { id: 3, mission: "Earn a score of 250", progress: 0, total: 1 },
    { id: 4, mission: "Earn a score of 300", progress: 0, total: 1 }, // Perfectionist
  ],
};
