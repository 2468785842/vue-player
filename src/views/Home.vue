<template>
  <div class="home">
    <MusicListGroup :playLists="personalized">热门推荐</MusicListGroup>
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
    this.personalized = await Api.getPersonalized(28);
  }
}
</script>

<style lang="scss" scoped>
.home {
  background: rgb(243, 243, 243);
}
</style>