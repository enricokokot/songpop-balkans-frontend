<template>
  <div class="about">
    <v-container class="text-justify">
      <h1>
        This is {{ userInfo.name.split(" ")[0] }}'s ({{ userInfo.id }}) Home
        Page
      </h1>
      <h2>Available playlists: {{ userInfo.playlists.join(", ") }}</h2>
      <h2>Available coins: {{ userInfo.coins }}</h2>
      <h2>Games played: {{ userInfo["games played"] }}</h2>
      <h2>Games won: {{ userInfo["games won"] }}</h2>
      <h2>Games lost: {{ userInfo["games lost"] }}</h2>
      <h2>Games tied: {{ userInfo["games tied"] }}</h2>
      <h2>Duels waiting on your response:</h2>
      <li v-for="duel in duelsWaitingOnResponseFromYou" :key="duel.id">
        {{ duel.id }} against
        {{
          allUsersWhoArentUserInfo.find((user) => user.id == duel.challengerId)
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
      <h2>Duels you're waiting to respond:</h2>
      <li v-for="duel in duelsWaitingOnResponseFromOthers" :key="duel.id">
        {{ duel.id }} against
        {{
          allUsersWhoArentUserInfo.find(
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
      <!-- <h2>Active duels:</h2>
      <li v-for="duel in userInfo.duels" :key="duel.id">
        Against {{ allUsers.find((user) => user.id == duel.against).name }} in
        {{ duel.playlist.toUpperCase() }} with a result of: {{ duel.score }} -
        {{
          allUsers
            .find((user) => user.id == duel.against)
            .duels.find((duel) => duel.against == userInfo.id).score
        }} -->
      <!-- </li> -->
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
    this.userInfo = userData[3];
    this.allUsers = userData;
    // this.allUsersWhoArentUserInfo = this.allUsers.filter((user) => {
    //   if (
    //     user.id != this.userInfo.id &&
    //     !this.userInfo.duels.find((duel) => duel.against == user.id)
    //   ) {
    //     return user;
    //   }
    // });
    this.allUsersWhoArentUserInfo = this.allUsers.filter(
      (user) => user.id != this.userInfo.id
    );
    const duelResponse = await fetch("http://localhost:3000/duel");
    const duelData = await duelResponse.json();
    this.duelsWaitingOnResponseFromYou = duelData.filter(
      (duel) => duel.challengeTakerId == this.userInfo.id
    );
    this.duelsWaitingOnResponseFromOthers = duelData.filter(
      (duel) => duel.challengerId == this.userInfo.id
    );
    const playlistResponse = await fetch("http://localhost:3000/playlist");
    const playlistData = await playlistResponse.json();
    this.allPlaylists = playlistData;
    const userIdsOfUsersWhoArentCurrentUser = this.allUsersWhoArentUserInfo.map(
      (user) => user.id
    );
    const userIdsOfChallengedUsers = this.duelsWaitingOnResponseFromYou.map(
      (duel) => duel.challengerId
    );
    const userIdsOfOtherChallengedUsers =
      this.duelsWaitingOnResponseFromOthers.map(
        (duel) => duel.challengeTakerId
      );
    // console.log(
    //   "userIdsOfUsersWhoArentCurrentUser",
    //   userIdsOfUsersWhoArentCurrentUser
    // );
    // console.log("userIdsOfChallengedUsers", userIdsOfChallengedUsers);
    // console.log("userIdsOfOtherChallengedUsers", userIdsOfOtherChallengedUsers);
    const userIdsOfAllChallengedUsers = userIdsOfChallengedUsers.concat(
      userIdsOfOtherChallengedUsers
    );
    // console.log("userIdsOfAllChallengedUsers", userIdsOfAllChallengedUsers);

    let UserIdsOfUsersWhoAreYetToDuel = [...userIdsOfUsersWhoArentCurrentUser];
    // console.log("UserIdsOfUsersWhoAreYetToDuel", UserIdsOfUsersWhoAreYetToDuel);

    // TODO: fix this hard patch, gotta look for a better way,
    // implemented because the forEach() did not work as planned
    if (
      userIdsOfAllChallengedUsers.sort().toString() ==
      userIdsOfUsersWhoArentCurrentUser.sort().toString()
    ) {
      UserIdsOfUsersWhoAreYetToDuel = [];
    } else {
      userIdsOfAllChallengedUsers.forEach((userId) => {
        UserIdsOfUsersWhoAreYetToDuel.splice(
          userIdsOfUsersWhoArentCurrentUser.indexOf(userId),
          1
        );
      });
    }

    // console.log("UserIdsOfUsersWhoAreYetToDuel", UserIdsOfUsersWhoAreYetToDuel);

    this.usersWhoAreYetToBeChallenged = UserIdsOfUsersWhoAreYetToDuel.map(
      (userId) =>
        this.allUsersWhoArentUserInfo.find((user) => user.id == userId)
    );
    // console.log(
    //   "this.usersWhoAreYetToBeChallenged",
    //   this.usersWhoAreYetToBeChallenged
    // );
  },
};
</script>
