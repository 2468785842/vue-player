<template>
  <div id="app">
    <NavBar />
    <keep-alive include="Home">
      <router-view></router-view>
    </keep-alive>
    <PlayerBar />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import PlayerBar from "@components/PlayerBar.vue";
import NavBar from "@components/NavBar.vue";

@Component({
  components: {
    PlayerBar,
    NavBar,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
}
</style>