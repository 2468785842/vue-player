<template>
  <div class="home">
    <MusicListGroup
      route-path="/"
      :loading="personalizedLoading"
      :play-lists="personalized"
    >
      热门推荐
    </MusicListGroup>
    <MusicGroup
      route-path="/"
      :loading="recommendMusicLoading"
      :musics="recommendMusic"
    >
      推荐歌曲
    </MusicGroup>
  </div>
</template>

<script lang="ts">
import { Api } from "@api/services";
import MusicListGroup from "@components/MusicListGroup.vue";
import MusicGroup from "@components/MusicGroup.vue";
import { MusicList } from "@model/MusicList";
import { Component, Vue } from "vue-property-decorator";
import { Music } from "@model/Music";

@Component({
  components: {
    MusicListGroup,
    MusicGroup,
  },
})
export default class Home extends Vue {
  personalized: MusicList[] = [];
  recommendMusic: Music[] = [];

  personalizedLoading: boolean = true;
  recommendMusicLoading: boolean = true;

  async mounted() {
    this.personalized = await Api.getPersonalized(12);
    this.personalizedLoading = false;
    this.recommendMusic = await Api.getRecommendMusic();
    this.recommendMusicLoading = false;
  }
}
</script>