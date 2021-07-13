<template>
  <div class="group">
    <div class="title">
      <slot></slot>
      <router-link :to="routePath" class="more">
        更多<i class="el-icon-arrow-right"></i>
      </router-link>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import { MusicList } from "@model/MusicList";
import { dateFormat } from "@utils/MusicUtils";

import { transformNumberToC } from "@utils/MusicUtils";

@Component({
  data() {
    return {
      transformNumberToC,
      dateFormat,
    };
  },
})
export default class MusicListGroup extends Vue {
  @Prop()
  musics?: MusicList[];

  @Prop({ type: Boolean, required: true })
  loading?: boolean;

  @Prop()
  routePath?: string;
}
</script>

<style lang="scss" scoped>
.group {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  align-content: stretch;
  flex-wrap: wrap;
  width: 1100px;
  margin: 0 auto;
  background: rgb(243, 243, 243);
}
</style>