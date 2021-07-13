<template>
  <div class="group">
    <div class="title">
      <slot></slot>
      <router-link :to="routePath" class="more"
        >更多<i class="el-icon-arrow-right"></i
      ></router-link>
    </div>
    <div v-if="loading" v-loading="loading" class="loading"></div>
    <template v-for="i of playLists">
      <div
        v-if="i !== undefined"
        class="item"
        v-bind:key="i.id"
        @click="setPlayList(i.id)"
      >
        <el-image class="cover" :src="i.picUrl" fit="cover" lazy></el-image>
        <div class="count">
          <i class="el-icon-headset"></i>&nbsp;{{
            transformNumberToC(i.playCount)
          }}
        </div>
        <a href="#" class="name">{{ i.name }}</a>
        <div class="time">
          {{
            dateFormat("YYYY-mm-dd HH:MM", new Date(i.trackNumberUpdateTime))
          }}
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { MusicList } from "@model/MusicList";
import { dateFormat } from "@utils/MusicUtils";

import { transformNumberToC } from "@utils/MusicUtils";
import { Api } from "@api/services";

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
  playLists?: MusicList[];

  @Prop({ type: Boolean, required: true })
  loading?: boolean;

  @Prop()
  routePath?: string;

  async setPlayList(id: number): Promise<void> {
    this.$store.state.playList = await Api.getMusicList(id);
    this.$store.state.currentPlayIndex = 0;
  }
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
  background: rgb(243, 243, 243);

  .title {
    width: 100%;
    padding: 10px 20px;
    font-weight: 700;
    font-size: 20px;
    border-bottom: 4px solid $--color-primary;

    .more {
      float: right;
      text-decoration: none;
      color: black;
      font-weight: normal;
      font-size: 1rem;

      &:hover {
        color: $--color-primary;
        text-decoration: underline;
      }
    }
  }

  .loading {
    margin: 10px 0px 0px;
    width: 100%;
    height: 400px;
    z-index: 0;
  }

  .item {
    display: inline-block;
    width: 200px;
    position: relative;
    margin: 10px 20px;
    border-radius: 5px;
    overflow: hidden;
    background: white;
    cursor: pointer;
    transition: all 0.1s linear;
    // border: 1px solid $--color-primary;

    &:hover {
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
      transform: translateY(-2px);
    }

    .cover {
      width: inherit;
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
      font-size: 16px;
      text-decoration: none;
      color: black;
      margin-bottom: 30px;

      &:hover {
        color: $--color-primary;
        text-decoration: underline $--color-primary;
      }
    }
    .time {
      display: block;
      padding: 0px 10px 10px;
      font-size: 13px;
      text-decoration: none;
      color: #aaa;
      position: absolute;
      bottom: 5px;
    }
  }
}
</style>