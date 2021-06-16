<template>
  <div id="app">
    <PlayerBar @privious="previous" @next="next" ref="playerBar" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PlayerBar, { PlayState } from "./components/PlayerBar.vue";
import Music from "./assets/music/献天缘.mp3";

@Component({
  components: {
    PlayerBar,
  },
})
export default class App extends Vue {
  private musicList: Array<HTMLAudioElement> = [new Audio(Music)];

  private music: HTMLAudioElement = this.musicList[0];

  public mounted(): void {
    (this.$refs.playerBar as PlayerBar).playMusic(this.music);
  }

  //上一首
  public previous(playState: PlayState): void {
    console.log(playState);
  }

  //下一首
  public next(playState: PlayState): void {
    console.log(playState);
  }
}
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
}
</style>