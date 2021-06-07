<template>
  <div id="app">
    <PlayerBar :endTime="end" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PlayerBar from "./components/PlayerBar.vue";

@Component({
  components: {
    PlayerBar,
  },
})
export default class App extends Vue {
  private end: number = 270;
}
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
}
</style>