<template>
  <div class="group">
    <div class="title">
      <slot></slot>
    </div>
    <template v-for="i of playLists">
      <div v-if="i !== undefined" class="item" v-bind:key="i.id">
        <img class="cover" :src="i.picUrl" />
        <div class="count">{{ i.playCount }}</div>
        <a href="#" class="name">{{ i.name }}</a>
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
@import "../red-theme";

.group {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  align-content: stretch;
  flex-wrap: wrap;
  width: 1100px;
  margin: 0 auto;

  .title {
    width: 100%;
    padding: 5px;
    font-weight: 700;
    font-size: 20px;
    // color: $--color-primary;
    border-bottom: 4px solid $--color-primary;
  }

  .item {
    display: inline-block;
    width: 140px;
    position: relative;
    margin: 10px 0;
    border-radius: 5px;
    overflow: hidden;
    background: white;
    cursor: pointer;
    transition: all .1s linear;
    // border: 1px solid $--color-primary;

    &:hover {
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
      transform: translateY(-2px);
    }

    .cover {
      width: 140px;
      height: 130px;
    }

    .count {
      position: absolute;
      top: 0px;
      right: 0px;
      color: $--color-primary;
      font-size: 12px;
      background: white;
      opacity: 0.8;
      padding: 2px;
    }

    .name {
      display: block;
      padding: 10px;
      font-size: 13px;
      text-decoration: none;
      color: black;
      &:hover {
        color: $--color-primary;
        text-decoration: underline $--color-primary;
      }
    }
  }
}
</style>