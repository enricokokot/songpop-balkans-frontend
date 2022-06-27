<template>
  <div class="about d-flex flex-column pa-16">
    <h1 class="text-center">Signin</h1>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="email"
        :rules="[rules.required]"
        label="E-mail"
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="[rules.required, rules.min]"
        :type="show ? 'text' : 'password'"
        label="Password"
        hint="At least 8 characters"
        counter
        @click:append="show = !show"
      ></v-text-field>

      <v-select
        v-model="select"
        :items="genres"
        :rules="[rules.required]"
        label="Preferred Genre"
        required
      ></v-select>

      <v-container class="d-flex flex-column justify-start">
        <v-btn
          :disabled="!valid"
          color="transparent"
          class="success--text ma-1"
          :elevation="0"
          @click="validate"
        >
          Sign in
        </v-btn>

        <v-btn
          color="transparent"
          class="error--text ma-1"
          :elevation="0"
          @click="reset"
        >
          Reset Form
        </v-btn>

        <v-btn
          color="transparent"
          class="warning--text ma-1"
          :elevation="0"
          @click="resetValidation"
        >
          Reset Validation
        </v-btn>
      </v-container>
    </v-form>
  </div>
</template>

<script>
export default {
  data: () => ({
    show: false,
    valid: true,
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    password: "",
    passwordRules: [
      (v) => !!v || "Password is required",
      (v) =>
        (v && v.length >= 8) || "Password must be at least 8 characters long",
    ],
    select: null,
    genres: ["Rock", "Pop", "Hip-Hop", "Metal"],
    rules: {
      required: (value) => !!value || "Required.",
      min: (v) => v.length >= 8 || "Min 8 characters",
      emailMatch: () => `The email and password you entered don't match`,
    },
  }),

  methods: {
    validate() {
      if (this.$refs.form.validate()) this.$router.push("/app2/about");
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
};
</script>
