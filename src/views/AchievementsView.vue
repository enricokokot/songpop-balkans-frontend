<template>
  <v-container fill-height fluid>
    <v-row class="align-center justify-center">
      <v-col>
        <v-row class="align-center justify-center pa-2"
          ><h1>This is your achievement progress so far</h1></v-row
        >
        <v-scroll-x-transition group>
          <v-container
            v-for="achievement in achievements"
            :key="achievement.id"
          >
            <v-card
              elevation="2"
              outlined
              :disabled="[1, 2].includes(achievement.id)"
            >
              <v-row class="ma-2">{{ achievement.mission }}</v-row>
              <v-spacer></v-spacer>
              <v-row class="ma-2"
                >{{ achievement.progress }}/{{ achievement.total }}</v-row
              >
              <v-row class="ma-2">
                <v-progress-linear
                  :value="(achievement.progress / achievement.total) * 100"
                ></v-progress-linear>
              </v-row>
            </v-card>
          </v-container>
        </v-scroll-x-transition>
        <v-row class="align-center justify-center pa-2 mt-8">
          <v-btn x-large color="primary" @click="goBack()" width="30%"
            >BACK
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { Auth, Users } from "@/services";

export default {
  name: "AchievementsView",
  data: () => ({
    userId: Auth.state.user.userId,
    achievements: [],
  }),
  methods: {
    goBack() {
      this.$router.back();
    },
    async fetchAllAchievements() {
      const allAchievements = await Users.getAllAchievements(this.userId);
      return allAchievements;
    },
  },
  async mounted() {
    this.achievements = await this.fetchAllAchievements();
  },
  computed: {
    //
  },
};
</script>
