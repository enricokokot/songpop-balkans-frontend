<template>
  <div class="about">
    <h1>This is {{ userInfo.name.split(" ")[0] }}'s Home Page</h1>
    <h2>Available playlists: {{ userInfo.playlists.join(", ") }}</h2>
    <h2>Active duels:</h2>
    <li v-for="duel in userInfo.duels" :key="duel.id">
      Against {{ allUsers.find((user) => user.id == duel.against).name }} in
      {{ duel.playlist.toUpperCase() }} with a result of: {{ duel.score }} -
      {{
        allUsers
          .find((user) => user.id == duel.against)
          .duels.find((duel) => duel.against == userInfo.id).score
      }}
    </li>
    <h2>Available coins: {{ userInfo.coins }}</h2>
    <h2>Games played: {{ userInfo["games played"] }}</h2>
    <h2>Games won: {{ userInfo["games won"] }}</h2>
    <h2>Games lost: {{ userInfo["games lost"] }}</h2>
    <h2>Games tied: {{ userInfo["games tied"] }}</h2>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  data: () => ({
    userInfo: {},
    allUsers: [],
  }),
  async mounted() {
    const response = await fetch("http://localhost:3000/user");
    const data = await response.json();
    this.userInfo = data[1];
    this.allUsers = data;
  },
};
</script>
