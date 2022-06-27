import Vue from "vue";
import VueRouter from "vue-router";
import LoginView from "../views/LoginView.vue";
import HomeView from "../views/HomeView.vue";
import PlayView from "../views/PlayView.vue";
import AchievementsView from "../views/AchievementsView.vue";
import StoreView from "../views/StoreView.vue";
import PrepareForDuelView from "../views/PrepareForDuelView.vue";
import GameView from "../views/GameView.vue";
import ScoreView from "../views/ScoreView.vue";
import TemplateView from "../views/TemplateView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "app2/login",
    name: "login",
    component: LoginView,
    meta: {
      hideNavbar: true,
    },
  },
  {
    path: "app2/",
    name: "home",
    component: HomeView,
  },
  {
    path: "app2/duel",
    name: "duel",
    component: PlayView,
  },
  {
    path: "app2/duel/start",
    name: "start",
    component: PrepareForDuelView,
  },
  {
    path: "app2/game",
    name: "game",
    component: GameView,
    meta: {
      hideNavbar: true,
    },
  },
  {
    path: "app2/score",
    name: "score",
    component: ScoreView,
  },
  {
    path: "app2/achievements",
    name: "achievements",
    component: AchievementsView,
  },
  {
    path: "app2/store",
    name: "store",
    component: StoreView,
  },
  {
    path: "app2/template",
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
