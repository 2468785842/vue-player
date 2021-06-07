<template>
  <div id="app">
    <PlayerBar :music="music" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PlayerBar from "./components/PlayerBar.vue";
import Music from "./assets/music/献天缘.mp3";

@Component({
  components: {
    PlayerBar,
  },
})
export default class App extends Vue {
  private music: HTMLAudioElement = new Audio(Music);
}
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
}
</style>