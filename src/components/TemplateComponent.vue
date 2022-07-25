<template>
  <v-card width="350" height="250" rounded class="ma-6">
    <v-card-title>{{ name }}</v-card-title>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "PlayerCard",
  props: {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
  },
});
</script>
