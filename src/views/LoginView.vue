<template>
  <!-- keeping fluid just in case i need it in the future -->
  <v-container fill-height fluid class="justify-center">
    <LoginForm />
    <SigninForm />
  </v-container>
</template>

<script lang="ts">
import LoginForm from "@/components/LoginForm.vue";
import SigninForm from "@/components/SigninForm.vue";
import { Auth } from "@/services";

export default {
  components: { LoginForm, SigninForm },

  data: () => ({
    auth: Auth.state,
  }),
};
</script>
