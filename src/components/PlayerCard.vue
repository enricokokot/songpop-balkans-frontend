<template>
  <v-card width="350" height="250" outlined rounded>
    <v-list-item three-line>
      <v-list-item-content>
        <v-list-item-title class="text-h5 mb-1">
          {{ player.name }}
        </v-list-item-title>
        <v-list-item-subtitle v-if="player.duel">{{
          prettifyTime(player.duel.time)
        }}</v-list-item-subtitle>
        <v-list-item-subtitle v-else class="transparent--text"
          >never hours ago</v-list-item-subtitle
        >
      </v-list-item-content>

      <v-badge
        v-if="player.name && player.appendedAchievement"
        :value="player.appendedAchievement.id >= 0"
        bordered
        bottom
        color="deep-purple accent-4"
        offset-x="35"
        offset-y="35"
      >
        <v-tooltip
          bottom
          :disabled="player.appendedAchievement.text === '' ? true : false"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-list-item-avatar
              v-if="player.name"
              left
              size="80"
              color="primary"
              v-bind="attrs"
              v-on="on"
              ><span class="white--text text-h5">{{
                player.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
              }}</span></v-list-item-avatar
            >
          </template>
          <span>{{ player.appendedAchievement.text }}</span>
        </v-tooltip>
      </v-badge>
    </v-list-item>

    <v-list-item
      class="text-h5 mb-1 text-center d-flex justify-center"
      v-if="!(player.score[0] === 0 && player.score[1] === 0)"
    >
      {{ player.score[0] }} - {{ player.score[1] }}
    </v-list-item>
    <v-list-item
      class="text-h5 mb-1 transparent--text d-flex justify-center"
      v-else
    >
      možel' 2?
    </v-list-item>

    <v-card-actions>
      <v-btn
        v-if="player.status === 'waiting'"
        x-large
        color="primary"
        @click="playADuel(player)"
        disabled
        block
        text
        >Their Turn</v-btn
      >
      <v-btn
        v-else
        x-large
        color="primary"
        @click="playADuel(player)"
        block
        text
        >{{ player.status }}</v-btn
      >
      <!-- <v-btn
        v-if="player.status !== 'challenge' && player.status !== 'waiting'"
        x-large
        color="error"
        @click="quitADuel(player.id)"
        block
        text
        >QUIT
      </v-btn> -->
    </v-card-actions>
  </v-card>
</template>

<script>
import moment from "moment";

export default {
  name: "PlayerCard",
  props: ["player"],
  methods: {
    playADuel(player) {
      this.$emit("eventname", player);
    },
    prettifyTime(time) {
      return time !== undefined ? moment(time).fromNow() : "";
    },
  },
};
</script>
