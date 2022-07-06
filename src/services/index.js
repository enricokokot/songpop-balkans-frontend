import axios from "axios";
import moment from "moment";

const Service = axios.create({
  baseURL: "http://localhost:3000",
  // raised because of game preparation time for Playlists.generateGame()
  timeout: 3000,
});

const Users = {
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
      (player) => !ids3.includes(player.id)
    );

    const everyPlayerOnThePage = specificPlayerDuelsWhereHeIsBeingChallenged
      .concat(specificPlayerDuelsWhereHeIsTheChallenger)
      .concat(allPlayersFiltered);
    const everyPlayerOnThePageModified = everyPlayerOnThePage
      .filter((player) => player.id !== currentUser)
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
            name: allPlayers.find((user) => user.id === player.challengerId)
              .name,
            result: [player.playerTwoTotalScore, player.playerOneTotalScore],
            status: "reply",
            playlist: player.playlist,
            rounds: player.rounds,
            duelId: player.id,
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
              rivalry.playerOneId === idsSortedByOrder[0] &&
              rivalry.playerTwoId === idsSortedByOrder[1]
          );
          const result = wantedRivalry
            ? currentUser === wantedRivalry.playerOneId
              ? [wantedRivalry.playerOneScore, wantedRivalry.playerTwoScore]
              : [wantedRivalry.playerTwoScore, wantedRivalry.playerOneScore]
            : [0, 0];
          return {
            id: player.challengeTakerId,
            name: allPlayers.find((user) => user.id === player.challengeTakerId)
              .name,
            result: [player.playerOneTotalScore, player.playerTwoTotalScore],
            status: "waiting",
            result,
            duelStartTime,
          };
        } else {
          const idsSortedByOrder =
            currentUser > player.id
              ? [player.id, currentUser]
              : [currentUser, player.id];
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
            id: player.id,
            name: player.name,
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

export { Service, Users, Duels, Playlists, Songs };
