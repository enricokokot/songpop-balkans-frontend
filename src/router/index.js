import Vue from "vue";
import VueRouter from "vue-router";
import LoginView from "../views/LoginView.vue";
import HomeView from "../views/HomeView.vue";
import PlayView from "../views/PlayView.vue";
import StoreView from "../views/StoreView.vue";
import PrepareForDuelView from "../views/PrepareForDuelView.vue";
import GameView from "../views/GameView.vue";
import ScoreView from "../views/ScoreView.vue";
import TemplateView from "../views/TemplateView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: {
      hideNavbar: true,
    },
  },
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/duel",
    name: "duel",
    component: PlayView,
  },
  {
    path: "/duel/start",
    name: "start",
    component: PrepareForDuelView,
  },
  {
    path: "/game",
    name: "game",
    component: GameView,
  },
  {
    path: "/score",
    name: "score",
    component: ScoreView,
  },
  {
    path: "/store",
    name: "store",
    component: StoreView,
  },
  {
    path: "/template",
    name: "template",
    component: TemplateView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
