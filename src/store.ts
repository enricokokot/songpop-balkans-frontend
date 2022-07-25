import { Duel, DuelAgainst, Rival, RoundDetails, User } from "@/types";

export default {
  players: [],
  duelAgainst: {} as DuelAgainst,
  duelResults: {
    user: {} as User,
    rival: {} as Rival,
    duel: {} as Duel,
    roundDetails: {} as RoundDetails,
  },
  playlists: [],
  allPlaylists: [],
  coins: 0,
  achievements: [],
  snackbar: false,
};
