<template>
  <div class="group">
    <div class="title">
      <slot></slot>
      <router-link :to="routePath" class="more"
        >更多<i class="el-icon-arrow-right"></i
      ></router-link>
    </div>
    <GroupLoading v-show="loading" :loading="loading"></GroupLoading>
    <template v-for="i of playLists">
      <div
        v-if="i !== undefined"
        :class="[{ 'on-play': onPlayId === i.id && !onLoading }, 'item']"
        v-bind:key="i.id"
        @click="setPlayList(i.id)"
      >
        <div class="play-icon">
          <div class="line" style="animation-delay: -1.2s"></div>
          <div class="line"></div>
          <div class="line" style="animation-delay: -1.5s"></div>
          <div class="line" style="animation-delay: -0.9s"></div>
          <div class="line" style="animation-delay: -0.6s"></div>
        </div>
        <div
          class="cover"
          v-loading="onPlayId === i.id && onLoading"
          element-loading-text="正在加载"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <el-image :src="i.picUrl" fit="cover" lazy></el-image>
        </div>
        <div class="count">
          <i class="el-icon-headset"></i>&nbsp;{{
            transformNumberToC(i.playCount)
          }}
        </div>
        <a href="#" class="name" @click.stop>{{ i.name }}</a>
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
import { PlayModeContext } from "@store/PlayMode";

import GroupLoading from "@components/GroupLoading.vue";
import { StateInterface } from "@store/state";

@Component({
  data() {
    return {
      transformNumberToC,
      dateFormat,
    };
  },
  components: {
    GroupLoading,
  },
})
export default class MusicListGroup extends Vue {
  @Prop()
  playLists?: MusicList[];

  @Prop({ type: Boolean, required: true })
  loading?: boolean;

  @Prop()
  routePath?: string;

  onPlayId: number = -1;
  onLoading: boolean = true;

  async setPlayList(id: number): Promise<void> {
    const tState = this.$store.state as StateInterface;
    this.onPlayId = id;
    this.onLoading = true;
    tState.playList = await Api.getMusicList(id);
    tState.currentPlayIndex = 0;
    // tState.music.src = tState.playList[tState.currentPlayIndex].url;
    PlayModeContext.resetMusic(tState);
    this.onLoading = false;
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

    &.on-play {
      .play-icon {
        display: flex;
        width: inherit;
        height: 16px;
        overflow: hidden;
        position: absolute;
        align-content: center;
        justify-content: center;
        top: 75px;
        z-index: 1;

        .line {
          width: 2px;
          height: 100%;
          margin-left: 2px;
          background-color: #ff410f;
          animation: play 0.9s linear infinite alternate;

          @keyframes play {
            from {
              transform: translateY(0);
            }
            to {
              transform: translateY(85%);
            }
          }
        }
      }

      &::after {
        display: block;
        width: 200px;
        height: 150px;
        content: "";
        color: white;
        position: absolute;
        top: 0px;
        text-align: center;
        line-height: 130px;
        background: rgba(0, 0, 0, 0.4);
      }
    }

    &:hover {
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
      transform: translateY(-2px);
    }

    .cover {
      width: inherit;
      height: 150px;
      & > div {
        width: inherit;
        height: inherit;
      }
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
      z-index: 1;
    }

    .name {
      display: block;
      padding: 15px 10px;
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