import Vue from "vue";
import VueRouter from "vue-router";
import LoginView from "../views/LoginView.vue";
import HomeView from "../views/HomeView.vue";
import PlayView from "../views/PlayView.vue";
import AchievementsView from "../views/AchievementsView.vue";
import ShopView from "../views/ShopView.vue";
import PrepareForDuelView from "../views/PrepareForDuelView.vue";
import GameView from "../views/GameView.vue";
import ScoreView from "../views/ScoreView.vue";
// import LoadingView from "../views/LoadingView.vue";
import TemplateView from "../views/TemplateView.vue";
import { Auth } from "@/services";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    component: HomeView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: {
      hideNavbar: true,
    },
  },
  {
    path: "/home",
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
  // {
  //   path: "/duel/loading",
  //   name: "loading",
  //   component: LoadingView,
  // },
  {
    path: "/game",
    name: "game",
    component: GameView,
    meta: {
      hideNavbar: true,
    },
  },
  {
    path: "/score",
    name: "score",
    component: ScoreView,
  },
  {
    path: "/achievements",
    name: "achievements",
    component: AchievementsView,
  },
  {
    path: "/shop",
    name: "shop",
    component: ShopView,
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

router.beforeEach((to, from, next) => {
  const publicPages = "/login";
  const authRequired = !publicPages.includes(to.path);
  const user = Auth.getUser();

  if (authRequired && !user) {
    return next("/login");
  }
  next();
});

export default router;
