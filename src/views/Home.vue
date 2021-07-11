<template>
  <div class="home">
    <MusicListGroup :playLists="personalized" />
  </div>
</template>

<script lang="ts">
import { Api } from "@api/services";
import MusicListGroup from "@components/MusicListGroup.vue";
import { MusicList } from "@model/MusicList";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {
    MusicListGroup,
  },
})
export default class Home extends Vue {
  personalized: MusicList[] = [];
  async mounted() {
    this.personalized = await Api.getPersonalized();
  }
}
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>