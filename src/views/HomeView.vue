<template>
  <div class="about">
    <v-container class="text-justify">
      <h1>This is {{ userInfo.name.split(" ")[0] }}'s Home Page</h1>
      <h2>Available playlists: {{ userInfo.playlists.join(", ") }}</h2>
      <h2>Available coins: {{ userInfo.coins }}</h2>
      <h2>Games played: {{ userInfo["games played"] }}</h2>
      <h2>Games won: {{ userInfo["games won"] }}</h2>
      <h2>Games lost: {{ userInfo["games lost"] }}</h2>
      <h2>Games tied: {{ userInfo["games tied"] }}</h2>
      <h2>Active duels:</h2>
      <li v-for="duel in userInfo.duels" :key="duel.id">
        Against {{ allUsers.find((user) => user.id == duel.against).name }} in
        {{ duel.playlist.toUpperCase() }} with a result of: {{ duel.score }} -
        {{
          allUsers
            .find((user) => user.id == duel.against)
            .duels.find((duel) => duel.against == userInfo.id).score
        }}
        <v-btn color="primary" @click="quitADuel(userInfo.id, duel.against)"
          >Quit</v-btn
        >
        <v-menu top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark v-bind="attrs" v-on="on"> Play </v-btn>
          </template>

          <v-list>
            <v-list-item v-for="(item, index) in items" :key="index">
              <v-list-item-title
                @click="
                  endADuel(
                    userInfo.id,
                    allUsers.find((user) => user.id == duel.against).id,
                    item.title,
                    allUsers
                      .find((user) => user.id == duel.against)
                      .duels.find((duel) => duel.against == userInfo.id).score
                  )
                "
                >{{ item.title }}</v-list-item-title
              >
            </v-list-item>
          </v-list>
        </v-menu>
      </li>
      <h2>Duel someone:</h2>
      <li v-for="user in allUsersWhoArentUserInfo" :key="user.id">
        {{ user.name }}
        <v-dialog transition="dialog-bottom-transition" max-width="600">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" v-bind="attrs" v-on="on">Challenge</v-btn>
          </template>
          <template v-slot:default="dialog">
            <v-card>
              <v-toolbar color="primary" dark
                >What genre do you want to challenge
                {{ user.name.split(" ")[0] }} in?</v-toolbar
              >
              <v-card-text>
                <li v-for="playlist in userInfo.playlists" :key="playlist">
                  <v-menu top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn color="primary" dark v-bind="attrs" v-on="on">
                        {{ playlist }}
                      </v-btn>
                    </template>

                    <v-list>
                      <v-list-item v-for="(item, index) in items" :key="index">
                        <v-list-item-title
                          @click="
                            sendADuel(
                              userInfo.id,
                              user.id,
                              playlist,
                              item.title
                            )
                          "
                          >{{ item.title }}</v-list-item-title
                        >
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </li>
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn text @click="dialog.value = false">Close</v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </li>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  data: () => ({
    userInfo: {},
    allUsers: [],
    allUsersWhoArentUserInfo: [],
    items: [
      { title: "0" },
      { title: "25" },
      { title: "50" },
      { title: "75" },
      { title: "90" },
      { title: "100" },
    ],
    closeOnClick: true,
  }),
  methods: {
    sendADuel: async (playerOneId, playerTwoId, playlist, playerOneScore) => {
      const response = await fetch("http://localhost:3000/duel/start", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerOneId: playerOneId,
          playerTwoId: playerTwoId,
          playlist: playlist,
          playerOneScore: playerOneScore,
        }),
      });
      const data = await response.json();
      console.log("Request complete! response:", data);
    },
    endADuel: async (
      playerOneId,
      playerTwoId,
      playerOneScore,
      playerTwoScore
    ) => {
      const response = await fetch("http://localhost:3000/duel/end", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerOneId: playerOneId,
          playerTwoId: playerTwoId,
          playerOneScore: playerOneScore,
          playerTwoScore: playerTwoScore,
        }),
      });
      const data = await response.json();
      console.log("Request complete! response:", data);
      // console.log(playerOneId, playerTwoId, playerOneScore, playerTwoScore);
    },
    quitADuel: async (playerOneId, playerTwoId) => {
      const response = await fetch("http://localhost:3000/duel/quit", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerOneId: playerOneId,
          playerTwoId: playerTwoId,
        }),
      });
      const data = await response.json();
      console.log("Request complete! response:", data);
    },
  },
  async mounted() {
    const response = await fetch("http://localhost:3000/user");
    const data = await response.json();
    this.userInfo = data[2];
    this.allUsers = data;
    this.allUsersWhoArentUserInfo = this.allUsers.filter((user) => {
      if (
        user.id != this.userInfo.id &&
        !this.userInfo.duels.find((duel) => duel.against == user.id)
      ) {
        return user;
      }
    });
  },
};
</script>
