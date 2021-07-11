<template>
  <div class="group">
    <template v-for="i of playLists">
      <div v-if="i !== undefined" class="item" v-bind:key="i.id">
        <img class="cover" :src="i.picUrl" />
        <div class="count">{{ i.playCount }}</div>
        <div class="name">{{ i.name }}</div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { MusicList } from "@model/MusicList";

@Component
export default class MusicListGroup extends Vue {
  @Prop()
  playLists?: MusicList[];
}
</script>

<style lang="scss" scoped>
.group {
  width: 1100px;
  .item {
    display: inline-block;
    width: 140px;
    height: 140px;
    position: relative;

    .cover {
      width: inherit;
      height: inherit;
    }

    .count {
      position: absolute;
      top: 0px;
      right: 0px;
      color: white;
      font-size: 12px;
      background: black;
      opacity: 0.8;
    }

    .name {
    }
  }
}
</style>