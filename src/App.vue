<template>
  <div id="app">
    <PlayerBar />
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
export default class App extends Vue {}
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
  // background-color: #2b2b2b;
}
</style>