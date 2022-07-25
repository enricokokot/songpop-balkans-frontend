<template>
  <div class="dashboard">
    <h1 class="subheading grey--text">Dashboards</h1>
    <v-container class="">
      <v-layout row wrap>
        <v-flex xs12 md6>
          <v-btn block class="primary">1</v-btn>
        </v-flex>
        <v-flex xs4 md2>
          <v-btn block class="primary">2</v-btn>
        </v-flex>
        <v-flex xs4 md2>
          <v-btn block class="primary">2</v-btn>
        </v-flex>
        <v-flex xs4 md2>
          <v-btn block class="primary">2</v-btn>
        </v-flex>
      </v-layout>

      <v-layout row wrap justify-space-around>
        <v-flex xs4 md3>
          <v-btn block class="success">1</v-btn>
        </v-flex>
        <v-flex xs4 md3>
          <v-btn block class="success">2</v-btn>
        </v-flex>
      </v-layout>

      <v-layout riow wrap>
        <v-flex v-for="name in names" :key="name">
          <TemplateComponent :name="name" />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import store from "@/store";
import TemplateComponent from "@/components/TemplateComponent.vue";

export default Vue.extend({
  name: "HomeView",
  components: { TemplateComponent },
  data: () => ({
    names: ["Dino", "Slavko", "Milka"],
  }),
  methods: {
    goBack() {
      this.$router.back();
    },
  },
  mounted() {
    //
  },
  computed: {
    //
  },
});
</script>
