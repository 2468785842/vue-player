<template>
  <div id="frame">
    <div class="left">
      <img src="../assets/svg/player-bar/pre.svg" class="btn" @click="pre" />
      <img
        :src="playing === 'pause' ? PauseSvg : PlaySvg"
        class="btn"
        @click="stateChange"
      />
      <img src="../assets/svg/player-bar/next.svg" class="btn" @click="next" />
    </div>
    <div class="middle">
      <span class="start-time">{{ dStartTime }}</span>
      <el-slider
        v-model="dProgress"
        :show-tooltip="false"
        @change="change"
      ></el-slider>
      <span class="end-time">{{ dEndTime }}</span>
    </div>
    <div class="right"></div>
  </div>
</template>

<script lang="ts">
/**
 * 播放条
 */
import { Component, Prop, Vue } from "vue-property-decorator";
import PlaySvg from "../assets/svg/player-bar/play.svg";
import PauseSvg from "../assets/svg/player-bar/pause.svg";
// import TimeUtils from '../utils/time-uitls';

type PlayState = "pause" | "play";

@Component({
  data() {
    return {
      PlaySvg: PlaySvg,
      PauseSvg: PauseSvg,
      dProgress: this.$props.progress,
      dStartTime: this.$props.startTime,
      dEndTime: this.$props.endTime,
    };
  },
})
export default class PlayerBar extends Vue {
  @Prop({ default: 0 }) private progress?: number;
  @Prop({ default: "00:00" }) private startTime?: string;
  @Prop({ default: "00:00" }) private endTime?: string;

  playing: PlayState = "pause"; //播放状态

  change(value: number) {
    console.log(value);
  }
  stateChange(): void {
    this.playing = this.playing === "pause" ? "play" : "pause";
    console.log(this.playing);
  }

  pre(): void {
    console.log("上一首");
  }
  next(): void {
    console.log("下一首");
  }
}
</script>

<style scoped lang="scss">
@import "../red-theme";

$frame-height: 70px;
#frame {
  @media screen and (max-width: 800px) {
    .el-slider {
      display: none !important;
    }
    .left {
      position: static !important;
      padding: {
        left: 0 !important;
      }
    }
  }
  border-top: 1px solid grey;
  width: 100%;
  height: $frame-height;
  position: fixed;
  bottom: 0;
  text-align: center;
  .middle {
    display: inline-block;
    line-height: $frame-height;
    .el-slider {
      display: inline-block;
      width: 400px;
      padding: {
        top: 15px;
      }
    }
    @mixin time-font($direction) {
      vertical-align: top;
      color: $--color-primary;
      font-size: 13px;
      font-weight: 500;
      padding-#{$direction}: 15px;
    }
    .start-time {
      @include time-font(right);
    }
    .end-time {
      @include time-font(left);
    }
  }
  .left {
    display: inline-block;
    position: absolute;
    padding: 10px 0 30px 10px;
    left: 0;
    .play {
      background-image: url(../assets/svg/player-bar/play.svg);
    }
    .pause {
      background-image: url(../assets/svg/player-bar/pause.svg);
    }
    & > btn {
      &:hover {
        cursor: pointer;
      }
    }
  }
  .btn {
    $size: 45px;
    width: $size;
    height: $size;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>