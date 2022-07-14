import axios from "axios";

import store from "@/store";
import $router from "@/router";

const Service = axios.create({
  baseURL: "https://songpop-balkans.herokuapp.com/",
  // baseURL: "http://localhost:3000",
  // raised because of game preparation time for Playlists.generateGame()
  timeout: 5000,
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
    console.log("error", error);
    if (["ECONNABORTED", "ERR_NETWORK"].includes(error.code)) {
      store.snackbar = true;
      $router.replace("/duel");
    }
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
  async getOrdered(id, page, username) {
    const response = await Service.get(
      `/user/${id}/ordered?page=${page}&username=${username}`
    );
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
