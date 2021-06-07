<template>
  <div id="frame">
    <div class="left">
      <img src="../assets/svg/player-bar/pre.svg" class="btn" @click="pre" />
      <img
        :src="playing === 'pause' ? PlaySvg : PauseSvg"
        class="btn"
        @click="stateChange"
      />
      <img src="../assets/svg/player-bar/next.svg" class="btn" @click="next" />
    </div>
    <div class="middle">
      <span class="current-time">{{
        MusicUtils.secondToMinute(dCurrentTime)
      }}</span>
      <el-slider
        v-model="progress"
        :show-tooltip="false"
        @change="change"
        @input="input"
      ></el-slider>
      <span class="end-time">{{ MusicUtils.secondToMinute(endTime) }}</span>
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
import MusicUtils from "../utils/music-uitls";

type PlayState = "pause" | "play";
type PlayMode = "loop" | "radom" | "loop-list";

@Component({
  data() {
    return {
      MusicUtils: MusicUtils,
      PlaySvg: PlaySvg,
      PauseSvg: PauseSvg,
      dCurrentTime: this.$props.currentTime,
    };
  },
})
export default class PlayerBar extends Vue {
  @Prop({ default: 0 }) private currentTime!: number;
  @Prop({ default: 0 }) private endTime!: number;

  private autoMove: number | undefined; //自动移动 异步事件

  private progress: number = 0; //0 ~ 100

  private playing: PlayState = "pause"; //播放状态
  private mode: PlayMode = "loop"; //播放状态

  mounted(): void {
    let slider_btn = document.querySelector(
      "#frame .el-slider .el-slider__runway"
    );
    if (slider_btn) {
      slider_btn.addEventListener("mousedown", this.down);
    }
  }

  /**
   * 松开进度条按钮时
   */
  change(): void {
    if (this.playing !== "pause") {
      this.autoMoveProgress();
    }
  }

  /**
   * 按下进度条时
   */
  down(): void {
    this.stopAutoMoveProgress();
  }

  input(value: number): void {
    if (!this.autoMove) {
      this.$data.dCurrentTime = (value / 100) * this.endTime;
    }
  }

  stateChange(): void {
    this.playing = this.playing === "pause" ? "play" : "pause";
    if (this.playing === "pause") {
      this.stopAutoMoveProgress();
    } else {
      this.autoMoveProgress();
    }
    console.log(this.playing);
  }

  pre(): void {
    console.log("上一首");
  }
  next(): void {
    console.log("下一首");
  }

  autoMoveProgress(): void {
    if (!this.autoMove) {
      //异步任务
      this.autoMove = setInterval(() => {
        //计算百分比, 0 ~ 100
        this.progress = MusicUtils.computedPercent(
          this.$data.dCurrentTime++,
          this.endTime
        );
      }, 1000);
    }
  }

  stopAutoMoveProgress(): void {
    if (this.autoMove) {
      clearInterval(this.autoMove);
      this.autoMove = undefined;
    }
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
      padding-top: 15px;
    }
    @mixin time-font($direction) {
      vertical-align: top;
      color: $--color-primary;
      font-size: 13px;
      font-weight: 500;
      padding-#{$direction}: 15px;
    }
    .current-time {
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