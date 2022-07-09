<template>
  <div class="about d-flex flex-column pa-16">
    <h1 class="text-center">Log In</h1>
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

      <v-btn
        :disabled="!valid"
        color="primary"
        @click="validate"
        class="my-5"
        block
      >
        LOG IN
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import { Auth } from "@/services";

export default {
  data: () => ({
    show: false,
    valid: true,
    username: "",
    nameRules: [(v) => !!v || "username is required"],
    password: "",
    passwordRules: [(v) => !!v || "password is required"],
    select: null,
  }),

  methods: {
    validate() {
      this.$refs.form.validate() && this.login();
    },
    async login() {
      const success = await Auth.login(this.username, this.password);
      success && this.$router.push("/home");
    },
  },
};
</script>
