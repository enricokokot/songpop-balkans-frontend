<template>
  <v-container fill-height fluid>
    <v-row class="align-center justify-center">
      <v-col>
        <v-row class="align-center justify-center pa-3 text-center"
          ><h2>This is your achievement progress so far</h2></v-row
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
              <v-card-title>{{ achievement.mission }}</v-card-title>
              <v-card-text class="d-flex justify-space-between">
                {{ achievement.progress }}/{{ achievement.total
                }}<v-btn
                  v-if="achievement.progress === achievement.total"
                  color="primary"
                  text
                  large
                  @click="append(achievement.id)"
                  >{{
                    appendedAchievement !== achievement.id ? "append" : "remove"
                  }}</v-btn
                >
              </v-card-text>
              <v-card-text>
                <v-progress-linear
                  :value="(achievement.progress / achievement.total) * 100"
                ></v-progress-linear>
              </v-card-text>
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
    user: {},
    userId: Auth.state.user.userId,
    achievements: [],
    appendedAchievement: null,
  }),
  methods: {
    goBack() {
      this.$router.back();
    },
    append(achievementId) {
      this.appendedAchievement =
        this.appendedAchievement == achievementId ? null : achievementId;
      Users.appendAchievement(this.userId, achievementId);
    },
    async fetchUser() {
      const user = await Users.getOne(this.userId);
      return user;
    },
  },
  async mounted() {
    this.user = await this.fetchUser();
    this.achievements = this.user.achievements;
    this.appendedAchievement = this.user.appendedAchievement;
  },
  computed: {
    //
  },
};
</script>
