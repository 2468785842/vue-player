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
        MusicUtils.secondToMinute(currentTime)
      }}</span>
      <el-slider
        v-model="progress"
        :show-tooltip="false"
        @change="change"
        @input="input"
        ref="elSlider"
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
import { Slider } from "element-ui";
import { Component, Emit, Vue } from "vue-property-decorator";
import PauseSvg from "../assets/svg/player-bar/pause.svg";
import PlaySvg from "../assets/svg/player-bar/play.svg";
import MusicUtils from "../utils/music-uitls";

type PlayState = "pause" | "play";
type PlayMode = "loop" | "radom" | "loop-list";

export { PlayState, PlayMode };

@Component({
  data() {
    return {
      MusicUtils,
      PlaySvg,
      PauseSvg,
    };
  },
})
export default class PlayerBar extends Vue {
  private music?: HTMLAudioElement;

  private autoMove: number | undefined; //自动移动 异步事件

  private progress: number = 0; //0 ~ 100

  private playing: PlayState = "pause"; //播放状态
  private mode: PlayMode = "loop"; //播放模式

  //音乐播放时间
  private currentTime: number = 0;
  private endTime: number = 0;

  public playMusic(music: HTMLAudioElement): void {
    if (music) {
      this.music = music;
      //循环播放
      this.music.loop = true;
      //当持续时间改变时
      this.music.addEventListener("durationchange", () => {
        if (this.music) {
          this.endTime = this.music.duration;
        }
      });
    }
  }

  public mounted(): void {
    //为进度条添加鼠标按下事件
    //循环获取Slider的dom节点
    [...((this.$refs.elSlider as Slider).$vnode.elm as Node).childNodes].every(
      (item: Node) => {
        console.log(item.nodeName);
        if (item.nodeName !== "#comment") {
          item.addEventListener("mousedown", this.down);
          return false;
        }
        return true;
      }
    );

    //当按下空格时, 暂停音乐
    window.addEventListener("keypress", (event: KeyboardEvent) => {
      if (event.code === "Space") {
        this.stateChange();
      }
    });
  }

  /**
   * 松开进度条按钮时
   */
  public change(): void {
    this.applayTimeToMusic();
    if (this.playing !== "pause") {
      this.autoMoveProgress();
    }
  }

  /**
   * 按下进度条时
   */
  public down(): void {
    this.stopAutoMoveProgress();
  }

  public input(value: number): void {
    if (!this.autoMove) {
      this.currentTime = (value / 100) * this.endTime;
    }
  }

  //播放状态改变时调用
  public stateChange(): void {
    this.playing = this.playing === "pause" ? "play" : "pause";
    if (this.playing === "pause") {
      this.music?.pause();
      this.stopAutoMoveProgress();
    } else {
      this.music?.play();
      this.autoMoveProgress();
    }
    console.log(this.playing);
  }

  @Emit("previous")
  public pre(): PlayState {
    console.log("上一首");
    return this.playing;
  }

  @Emit("next")
  public next(): PlayState {
    console.log("下一首");
    return this.playing;
  }

  private autoMoveProgress(): void {
    if (!this.autoMove) {
      //异步任务
      this.autoMove = setInterval(() => {
        if (this.currentTime >= this.endTime) {
          this.progress = 0;
          this.currentTime = 0;
        }
        //计算百分比, 0 ~ 100
        this.progress = MusicUtils.computedPercent(
          this.currentTime++,
          this.endTime
        );
      }, 1000);
    }
  }

  private stopAutoMoveProgress(): void {
    if (this.autoMove) {
      clearInterval(this.autoMove);
      this.autoMove = undefined;
    }
  }

  // 应用进度条的时间到音乐
  private applayTimeToMusic(): void {
    if (this.music) {
      console.log(this.music.currentTime);
      this.music.currentTime = this.currentTime;
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