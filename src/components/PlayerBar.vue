<template>
  <div id="frame">
    <div class="content">
      <!-- 左边的一组 -->
      <div class="left">
        <img
          src="@/assets/svg/player-bar/left/pre.svg"
          class="btn"
          @click="previous"
        />
        <img
          :src="$store.state.playState === 'pause' ? PlaySvg : PauseSvg"
          class="btn play"
          @click="stateChange"
        />
        <img
          src="@/assets/svg/player-bar/left/next.svg"
          class="btn"
          @click="next"
        />
      </div>

      <!-- 中间 -->
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

      <!-- 右边 -->
      <div class="right">
        <img
          src="@/assets/svg/player-bar/right/volum.svg"
          class="small-btn volum"
          @click="showVolum"
        />
        <img
          :src="playModeIcon[$store.state.playMode]"
          class="small-btn"
          @click="modeChange"
        />
        <img
          src="@/assets/svg/player-bar/right/play-list.svg"
          class="small-btn"
          @click="showPlayList"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * 播放条
 */
import PauseSvg from "@assets/svg/player-bar/left/pause.svg";
import PlaySvg from "@assets/svg/player-bar/left/play.svg";

import LoopList from "@assets/svg/player-bar/right/loop-list.svg";
import Loop from "@assets/svg/player-bar/right/loop.svg";
import Random from "@assets/svg/player-bar/right/random.svg";

import { PlayModeContext } from "@store/PlayMode";
import { StateInterface } from "@store/state";
import { CHANGE_PLAY_MODE, CHANGE_PLAY_STATE } from "@store/type";
import MusicUtils from "@utils/MusicUitls";
import { Slider } from "element-ui";
import { Component, Vue } from "vue-property-decorator";

@Component({
  data() {
    return {
      MusicUtils,
      PlaySvg,
      PauseSvg,
      playModeIcon: {
        "loop-list": LoopList,
        loop: Loop,
        random: Random,
      },
    };
  },
})
export default class PlayerBar extends Vue {
  private autoMove: number | undefined; //自动移动 异步事件

  private progress: number = 0; //0 ~ 100, 当前音乐播放进度百分比

  //音乐播放时间
  private currentTime: number = 0;
  private endTime: number = 0;

  public mounted(): void {
    let tState: any = this.$store.state;
    if (tState.music) {
      //当持续时间改变时
      tState.music.addEventListener("durationchange", () => {
        if (tState.music) {
          this.endTime = tState.music.duration;
        }
      });
    }

    //为进度条添加鼠标按下事件
    //循环获取Slider的dom节点
    [...((this.$refs.elSlider as Slider).$vnode.elm as Node).childNodes].every(
      (item: Node) => {
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

  //松开进度条按钮时
  public change(): void {
    //只有在抬起之后才应用快进的时间
    this.applayTimeToMusic();
    if (this.$store.state.playMode !== "pause") {
      this.autoMoveProgress();
    }
  }

  //按下进度条时
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
    //改变播放状态
    this.$store.commit(CHANGE_PLAY_STATE);

    let tPlayState = this.$store.state as StateInterface;

    if (!this.$store.state.music.src) return;

    if (tPlayState.playState === "pause") {
      this.$store.state.music.pause();
      this.stopAutoMoveProgress();
    } else {
      this.$store.state.music.play();
      this.autoMoveProgress();
    }
  }

  //只是移动进度条，不会对音乐播放做任何事
  private autoMoveProgress(): void {
    if (!this.autoMove) {
      //异步任务
      this.autoMove = setInterval(() => {
        //播放一首歌曲完毕时
        if (this.currentTime >= this.endTime) {
          this.progress = 0;
          this.currentTime = 0;
          let tPlayMode = this.$store.getters.playMode as PlayModeContext;
          //根据播放模式自动选择下一首
          if (this.$store.state.playList.length !== 0) tPlayMode.autoPlay();
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
    if (this.$store.state.music) {
      this.$store.state.music.currentTime = this.currentTime;
    }
  }

  //下一首
  public previous(): void {
    console.log("previous...");
  }

  //上一首
  public next(): void {
    console.log("next...");
  }

  public showVolum(): void {}

  public modeChange(): void {
    this.$store.commit(CHANGE_PLAY_MODE);
  }

  public showPlayList(): void {}
}
</script>

<style scoped lang="scss">
@import "../red-theme";

$frame-height: 60px;

#frame {
  background: white;
  border-top: 2px solid $--color-primary;
  width: 100%;
  height: $frame-height;
  position: fixed;
  bottom: 0px;
  text-align: center;

  .content {
    width: 1100px;
    margin: 0px auto;

    .middle {
      display: inline-block;
      line-height: $frame-height;

      .el-slider {
        display: inline-block;
        width: 400px;
        padding-top: 10px;
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
      float: left;
    }

    .right {
      float: right;
      margin: 15px 0;
    }

    .btn {
      background-repeat: no-repeat;
      vertical-align: middle;
      width: 45px;
      height: 45px;

      &:hover {
        cursor: pointer;
      }
    }

    .small-btn {
      @extend .btn;
      width: 35px;
      height: 35px;
      line-height: 30px;
      padding: 0 5px;
    }

    .volum {
      width: 30px;
      height: 30px;
    }

    .play {
      width: 60px;
      height: 60px;
    }
  }
}
</style>