<template>
  <div class="about d-flex flex-column px-16">
    <h1 class="text-center">Sign In</h1>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="username"
        :rules="nameRules"
        label="username"
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
        :type="show ? 'text' : 'password'"
        :rules="passwordRules"
        @click:append="show = !show"
        label="password"
        required
      ></v-text-field>

      <v-select
        v-model="select"
        :items="playlists"
        :rules="playlistRules"
        item-text="title"
        item-disabled="isEmpty"
        label="preferred playlist"
        required
      ></v-select>

      <v-btn
        :disabled="!valid"
        color="primary"
        @click="validate"
        class="my-5"
        block
      >
        SIGN IN
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import { Auth, Users, Playlists } from "@/services";

export default {
  data: () => ({
    show: false,
    valid: true,
    username: "",
    nameRules: [
      (v) => !!v || "username is required",
      (v) => v.indexOf(" ") < 0 || "username can't contain whitespaces",
    ],
    password: "",
    passwordRules: [(v) => !!v || "password is required"],
    select: null,
    playlistRules: [(v) => !!v || "playlist is required"],
    playlists: [],
  }),
  async mounted() {
    const rawPlaylists = await Playlists.getAll();
    this.playlists = await rawPlaylists.map((playlist) => {
      return { title: playlist.title, isEmpty: playlist.songs.length < 12 };
    });
  },
  methods: {
    validate() {
      this.$refs.form.validate() && this.register("/home");
    },
    async register() {
      const data = {
        username: this.username,
        password: this.password,
        playlist: this.select,
      };
      const registered = await Users.register(data);
      console.log("registered:", registered);
      const success = await Auth.login(this.username, this.password);
      success && this.$router.push("/home");
    },
  },
};
</script>
