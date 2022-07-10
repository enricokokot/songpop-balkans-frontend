import axios from "axios";
import moment from "moment";

import $router from "@/router";

const Service = axios.create({
  baseURL: "https://songpop-balkans.herokuapp.com/",
  // raised because of game preparation time for Playlists.generateGame()
  timeout: 3000,
});

Service.interceptors.request.use((request) => {
  try {
    request.headers["Authorization"] = "Bearer " + Auth.getToken();
  } catch (e) {
    console.error(e);
  }
  return request;
});

Service.interceptors.response.use(
  (response) => {
    // console.log("Interceptor", response);
    return response;
  },
  (error) => {
    if (error.response.status == 401) {
      Auth.logout();
      $router.go();
    }
    // console.error('Interceptor', error.response);
  }
);

const Users = {
  async register(userData) {
    const response = await Service.post(`/user`, userData);
    const data = response.data;
    return data;
  },
  async getOne(id) {
    const response = await Service.get(`/user/${id}`);
    const data = response.data;
    return data;
  },
  async getAll() {
    const response = await Service.get("/user");
    const data = response.data;
    return data;
  },
  async getCoins(userId) {
    const response = await Service.get(`/user/${userId}/coin`);
    const data = response.data;
    return data.availableCoins;
  },
  async getAllAchievements(userId) {
    const response = await Service.get(`/user/${userId}/achievement`);
    const data = response.data;
    return data;
  },
  async getPlaylists(userId) {
    const response = await Service.get(`/user/${userId}/playlist`);
    const data = response.data;
    return data;
  },
  async getAllRivalries(userId) {
    const response = await Service.get(`/user/${userId}/rivalry`);
    const data = response.data;
    return data;
  },
  async updateAchievement(userId, achievementId) {
    const response = await Service.patch(
      `/user/${userId}/achievement/${achievementId}`
    );
    const data = response.data;
    return data;
  },
  transformAll(allPlayers, allDuels, currentUser, allUserRivalries) {
    const {
      specificPlayerDuelsWhereHeIsTheChallenger,
      specificPlayerDuelsWhereHeIsBeingChallenged,
    } = allDuels;
    const ids1 = specificPlayerDuelsWhereHeIsTheChallenger.map(
      (duel) => duel.challengeTakerId
    );
    const ids2 = specificPlayerDuelsWhereHeIsBeingChallenged.map(
      (duel) => duel.challengerId
    );
    const ids3 = ids1.concat(ids2);
    const allPlayersFiltered = allPlayers.filter(
      (player) => !ids3.includes(player._id)
    );

    const everyPlayerOnThePage = specificPlayerDuelsWhereHeIsBeingChallenged
      .concat(specificPlayerDuelsWhereHeIsTheChallenger)
      .concat(allPlayersFiltered);
    const everyPlayerOnThePageModified = everyPlayerOnThePage
      .filter((player) => player._id !== currentUser)
      .map((player) => {
        if (player.rounds && player.challengeTakerId === currentUser) {
          const duelStartTime = player.time
            ? moment(player.time).fromNow()
            : "...";
          const idsSortedByOrder =
            currentUser > player.challengerId
              ? [player.challengerId, currentUser]
              : [currentUser, player.challengerId];
          const wantedRivalry = allUserRivalries.find(
            (rivalry) =>
              rivalry.playerOneId === idsSortedByOrder[0] &&
              rivalry.playerTwoId === idsSortedByOrder[1]
          );
          const result = wantedRivalry
            ? currentUser === wantedRivalry.playerOneId
              ? [wantedRivalry.playerOneScore, wantedRivalry.playerTwoScore]
              : [wantedRivalry.playerTwoScore, wantedRivalry.playerOneScore]
            : [0, 0];
          return {
            id: player.challengerId,
            name: allPlayers.find((user) => user._id === player.challengerId)
              .username,
            result: [player.playerTwoTotalScore, player.playerOneTotalScore],
            status: "reply",
            playlist: player.playlist,
            rounds: player.rounds,
            duelId: player._id,
            result,
            duelStartTime,
          };
        } else if (player.rounds && player.challengeTakerId !== currentUser) {
          const duelStartTime = player.time
            ? moment(player.time).fromNow()
            : "...";
          const idsSortedByOrder =
            currentUser > player.challengeTakerId
              ? [player.challengeTakerId, currentUser]
              : [currentUser, player.challengeTakerId];
          const wantedRivalry = allUserRivalries.find(
            (rivalry) =>
              rivalry.playerTwoId === idsSortedByOrder[1] &&
              rivalry.playerOneId === idsSortedByOrder[0]
          );
          const result = wantedRivalry
            ? currentUser === wantedRivalry.playerOneId
              ? [wantedRivalry.playerOneScore, wantedRivalry.playerTwoScore]
              : [wantedRivalry.playerTwoScore, wantedRivalry.playerOneScore]
            : [0, 0];
          return {
            id: player.challengeTakerId,
            name: allPlayers.find(
              (user) => user._id === player.challengeTakerId
            ).username,
            result: [player.playerOneTotalScore, player.playerTwoTotalScore],
            status: "waiting",
            result,
            duelStartTime,
          };
        } else {
          const idsSortedByOrder =
            currentUser > player._id
              ? [player._id, currentUser]
              : [currentUser, player._id];
          const wantedRivalry = allUserRivalries.find(
            (rivalry) =>
              rivalry.playerOneId === idsSortedByOrder[0] &&
              rivalry.playerTwoId === idsSortedByOrder[1]
          );
          const result = wantedRivalry
            ? currentUser === wantedRivalry.playerOneId
              ? [wantedRivalry.playerOneScore, wantedRivalry.playerTwoScore]
              : [wantedRivalry.playerTwoScore, wantedRivalry.playerOneScore]
            : [0, 0];
          return {
            id: player._id,
            name: player.username,
            result: [0, 0],
            status: "challenge",
            result,
          };
        }
      });
    return everyPlayerOnThePageModified;
  },
};

const Duels = {
  async getAll(userId) {
    const response = await Service.get(`/duel/${userId}`);
    const data = response.data;
    return data;
  },
  async start(data) {
    const response = await Service.post(`/duel/start`, data);
    const responseData = response.data;
    return responseData;
  },
  async end(data) {
    const response = await Service.put(`/duel/end`, data);
    const responseData = response.data;
    return responseData;
  },
};

const Playlists = {
  async getOne(id) {
    const response = await Service.get(`/playlist/${id}`);
    const data = response.data;
    return data;
  },
  async getAll() {
    const response = await Service.get(`/playlist`);
    const data = response.data;
    return data;
  },
  async buy(data) {
    const response = await Service.put(`/playlist/buy`, data);
    const responseData = response.data;
    return responseData;
  },
  async generateGame(id) {
    const response = await Service.get(`/playlist/${id}/game`);
    const data = response.data;
    return data;
  },
};

const Songs = {
  async getAudio(id) {
    const response = await Service.get(`/song/${id}/audio`, {
      responseType: "arraybuffer",
      headers: {
        "Content-Type": "audio/wav",
      },
    });
    const data = response.data;
    return data;
  },
};

const Auth = {
  async login(username, password) {
    const response = await Service.post("/auth", {
      username,
      // good to hash password here before it starts travel
      password,
    });

    const user = response.data;
    localStorage.setItem("user", JSON.stringify(user));

    return true;
  },

  logout() {
    localStorage.removeItem("user");
  },

  getToken() {
    let user = Auth.getUser();
    if (user && user.token) {
      return user.token;
    }
  },

  getUser() {
    return JSON.parse(localStorage.getItem("user"));
  },

  authenticated() {
    let user = Auth.getUser();
    if (user && user.userId) {
      return true;
    }
    return false;
  },

  state: {
    get user() {
      return Auth.getUser();
    },
    get authenticated() {
      return Auth.authenticated();
    },
  },
};

export { Service, Users, Duels, Playlists, Songs, Auth };
