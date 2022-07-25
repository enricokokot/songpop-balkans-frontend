import axios from "axios";

import store from "@/store";
import $router from "@/router";
import { Rounds } from "@/types";

const Service = axios.create({
  baseURL: "https://songpop-balkans.herokuapp.com/",
  // baseURL: "http://localhost:3000",
  // raised because of game preparation time for Playlists.generateGame()
  timeout: 5000,
});

Service.interceptors.request.use((request) => {
  try {
    if (request.headers === undefined) {
      throw new Error("request.headers is undefined");
    } else {
      request.headers["Authorization"] = "Bearer " + Auth.getToken();
    }
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
    console.log("error", error);
    if (["ECONNABORTED", "ERR_NETWORK"].includes(error.code)) {
      store.snackbar = true;
      $router.replace("/duel");
    }
    if (error.response.status == 401) {
      Auth.logout();
      $router.go(100);
    }
    // console.error('Interceptor', error.response);
  }
);

const Users = {
  async register(userData: {
    username: string;
    password: string;
    playlist: string | null;
  }) {
    const response = await Service.post(`/user`, userData);
    const data = response.data;
    return data;
  },
  async getOne(id: string) {
    const response = await Service.get(`/user/${id}`);
    const data = response.data;
    return data;
  },
  async getAll() {
    const response = await Service.get("/user");
    const data = response.data;
    return data;
  },
  async getOrdered(id: string, page: number, username: string) {
    const response = await Service.get(
      `/user/${id}/ordered?page=${page}&username=${username}`
    );
    const data = response.data;
    return data;
  },
  async getCoins(userId: string) {
    const response = await Service.get(`/user/${userId}/coin`);
    const data = response.data;
    return data.availableCoins;
  },
  async getAllAchievements(userId: string) {
    const response = await Service.get(`/user/${userId}/achievement`);
    const data = response.data;
    return data;
  },
  async getPlaylists(userId: string) {
    const response = await Service.get(`/user/${userId}/playlist`);
    const data = response.data;
    return data;
  },
  async getAllRivalries(userId: string) {
    const response = await Service.get(`/user/${userId}/rivalry`);
    const data = response.data;
    return data;
  },
  async appendAchievement(userId: string, achievementId: number) {
    const response = await Service.put(
      `/user/${userId}/achievement/${achievementId}`
    );
    const data = response.data;
    return data;
  },
  async updateAchievement(userId: string, achievementId: number) {
    const response = await Service.patch(
      `/user/${userId}/achievement/${achievementId}`
    );
    const data = response.data;
    return data;
  },
};

const Duels = {
  async getAll(userId: string) {
    const response = await Service.get(`/duel/${userId}`);
    const data = response.data;
    return data;
  },
  async start(data: {
    challengerId: string;
    challengeTakerId: string;
    playlist: string;
    challengerScore: number;
    roundsData: Rounds;
  }) {
    const response = await Service.post(`/duel/start`, data);
    const responseData = response.data;
    return responseData;
  },
  async end(data: { duelId: string; challengeeScore: number }) {
    const response = await Service.put(`/duel/end`, data);
    const responseData = response.data;
    return responseData;
  },
};

const Playlists = {
  async getOne(id: string) {
    const response = await Service.get(`/playlist/${id}`);
    const data = response.data;
    return data;
  },
  async getAll() {
    const response = await Service.get(`/playlist`);
    const data = response.data;
    return data;
  },
  async buy(data: { playerId: string; playlistTitle: string }) {
    const response = await Service.put(`/playlist/buy`, data);
    const responseData = response.data;
    return responseData;
  },
  async generateGame(id: string) {
    const response = await Service.get(`/playlist/${id}/game`);
    const data = response.data;
    return data;
  },
};

const Songs = {
  async getAudio(id: string) {
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
  async login(username: string, password: string) {
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
    const userIsString = function (user: string | null): user is string {
      return typeof user === "string";
    };
    const user: string | null = localStorage.getItem("user");
    if (userIsString(user)) {
      return JSON.parse(user);
    }
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
