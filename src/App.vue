<template>
  <v-app>
    <v-app-bar v-if="!$route.meta.hideNavbar" app class="indigo" dark>
      <div class="d-flex align-center">
        <router-link style="text-decoration: none; color: inherit" to="/">
          <h2>SONGPOP BALKANS</h2>
        </router-link>
      </div>
    </v-app-bar>

    <v-main class="indigo lighten-5">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),

  methods: {
    goToHome() {
      this.$router.push("/");
    },
  },
};
</script>
