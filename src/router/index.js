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
// import LoadingView from "../views/LoadingView.vue";
import TemplateView from "../views/TemplateView.vue";
import GameAnswers from "../components/GameAnswers.vue";
import GameAnswers2 from "../components/GameAnswers2.vue";
import GameAnswers3 from "../components/GameAnswers3.vue";
import { Auth } from "@/services";

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
    children: [
      {
        path: "round1",
        name: "round1",
        props: true,
        component: GameAnswers,
      },
      {
        path: "round2",
        name: "round2",
        props: true,
        component: GameAnswers2,
      },
      {
        path: "round3",
        name: "round3",
        props: true,
        component: GameAnswers3,
      },
    ],
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
