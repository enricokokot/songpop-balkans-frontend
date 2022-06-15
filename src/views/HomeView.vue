<template>
  <div class="about">
    <v-container class="text-justify">
      <h1>
        This is {{ localUser.name.split(" ")[0] }}'s ({{ localUser.id }}) Home
        Page
      </h1>
      <h2>Available playlists: {{ localUser.playlists.join(", ") }}</h2>
      <h2>Available coins: {{ localUser.coins }}</h2>
      <h2>Games played: {{ localUser["games played"] }}</h2>
      <h2>Games won: {{ localUser["games won"] }}</h2>
      <h2>Games lost: {{ localUser["games lost"] }}</h2>
      <h2>Games tied: {{ localUser["games tied"] }}</h2>
      <h2>Duels waiting on your response:</h2>
      <li v-for="duel in duelsWaitingOnResponseFromYou" :key="duel.id">
        {{ duel.id }} against
        {{
          allUsersWhoArentLocalUser.find((user) => user.id == duel.challengerId)
            .name
        }}
        in
        {{
          allPlaylists.find((playlist) => playlist.id == duel.playlist).title
        }}
        with a result of {{ duel.challengeTakerScore }} -
        {{ duel.challengerScore }}
        <v-btn color="primary" @click="quitADuel(duel.id)">Quit</v-btn>
        <v-menu top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark v-bind="attrs" v-on="on"> Play </v-btn>
          </template>

          <v-list>
            <v-list-item v-for="(item, index) in items" :key="index">
              <v-list-item-title
                @click="
                  endADuel(
                    localUser.id,
                    allUsers.find((user) => user.id == duel.against).id,
                    item.title,
                    allUsers
                      .find((user) => user.id == duel.against)
                      .duels.find((duel) => duel.against == localUser.id).score
                  )
                "
                >{{ item.title }}</v-list-item-title
              >
            </v-list-item>
          </v-list>
        </v-menu>
      </li>
      <h2>Duels you're waiting to respond:</h2>
      <li v-for="duel in duelsWaitingOnResponseFromOthers" :key="duel.id">
        {{ duel.id }} against
        {{
          allUsersWhoArentLocalUser.find(
            (user) => user.id == duel.challengeTakerId
          ).name
        }}
        in
        {{
          allPlaylists.find((playlist) => playlist.id == duel.playlist).title
        }}
        with a result of {{ duel.challengerScore }} -
        {{ duel.challengeTakerScore }}
        <v-btn color="primary" @click="quitADuel(duel.id)">Quit</v-btn>
      </li>
      <h2>Duel someone:</h2>
      <li v-for="user in usersWhoAreYetToBeChallenged" :key="user.id">
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
                <li v-for="playlist in localUser.playlists" :key="playlist">
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
                              localUser.id,
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
    localUser: {},
    allUsers: [],
    allUsersWhoArentLocalUser: [],
    duelsWaitingOnResponseFromYou: [],
    duelsWaitingOnResponseFromOthers: [],
    usersWhoAreYetToBeChallenged: [],
    allPlaylists: [],
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
        method: "POST",
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
    },
    quitADuel: async (duelId) => {
      const response = await fetch("http://localhost:3000/duel/quit", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          duelId: duelId,
        }),
      });
      const data = await response.json();
      console.log("Request complete! response:", data);
    },
  },
  async mounted() {
    const userResponse = await fetch("http://localhost:3000/user");
    const userData = await userResponse.json();
    this.localUser = userData[3];
    this.allUsers = userData;
    this.allUsersWhoArentLocalUser = this.allUsers.filter(
      (user) => user.id != this.localUser.id
    );
    const duelResponse = await fetch("http://localhost:3000/duel");
    const duelData = await duelResponse.json();
    this.duelsWaitingOnResponseFromYou = duelData.filter(
      (duel) => duel.challengeTakerId == this.localUser.id
    );
    this.duelsWaitingOnResponseFromOthers = duelData.filter(
      (duel) => duel.challengerId == this.localUser.id
    );
    const playlistResponse = await fetch("http://localhost:3000/playlist");
    const playlistData = await playlistResponse.json();
    this.allPlaylists = playlistData;
    const userIdsOfUsersWhoArentCurrentUser =
      this.allUsersWhoArentLocalUser.map((user) => user.id);
    const userIdsOfChallengedUsers = this.duelsWaitingOnResponseFromYou.map(
      (duel) => duel.challengerId
    );
    const userIdsOfOtherChallengedUsers =
      this.duelsWaitingOnResponseFromOthers.map(
        (duel) => duel.challengeTakerId
      );
    const userIdsOfAllChallengedUsers = userIdsOfChallengedUsers.concat(
      userIdsOfOtherChallengedUsers
    );

    const userIdsOfUsersWhoAreYetToDuel = [
      ...userIdsOfUsersWhoArentCurrentUser,
    ];

    userIdsOfAllChallengedUsers.forEach((userId) =>
      userIdsOfUsersWhoAreYetToDuel.splice(
        userIdsOfUsersWhoAreYetToDuel.findIndex(
          (thisUserId) => thisUserId == userId
        ),
        1
      )
    );

    this.usersWhoAreYetToBeChallenged = userIdsOfUsersWhoAreYetToDuel.map(
      (userId) =>
        this.allUsersWhoArentLocalUser.find((user) => user.id == userId)
    );
  },
};
</script>
