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
        <div class="music-desc">
          <img class="cover" :src="cover" />
          <div class="name">{{ name }}</div>
          <div class="author">{{ author }}</div>
        </div>

        <span class="current-time">{{ secondToMinute(currentTime) }}</span>
        <el-slider
          v-model="progress"
          :show-tooltip="false"
          @change="change"
          @input="input"
          ref="elSlider"
        ></el-slider>
        <span class="end-time">{{ secondToMinute(endTime) }}</span>
      </div>

      <!-- 右边 -->
      <div class="right">
        <div class="volum">
          <transition name="volum-fade-out">
            <el-slider
              vertical
              v-show="showVolum"
              v-model="volum"
              :show-tooltip="false"
              @change="changeVolum"
            ></el-slider>
          </transition>
          <img
            src="@/assets/svg/player-bar/right/volum.svg"
            class="small-btn"
            @click="showVolum = !showVolum"
            title="音量"
          />
        </div>
        <img
          :src="playModeIcon[$store.state.playMode]"
          class="small-btn"
          @click="modeChange"
        />
        <img
          src="@/assets/svg/player-bar/right/play-list.svg"
          class="small-btn"
          @click="showPlayList = !showPlayList"
          title="播放列表"
        />
        <div class="hidden btn"><i class="el-icon-arrow-down"></i></div>
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
import { computedPercent, secondToMinute } from "@utils/MusicUtils";
import { Slider } from "element-ui";
import { Component, Vue } from "vue-property-decorator";

@Component({
  data() {
    return {
      secondToMinute,
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

  private volum: number = 0;
  private showVolum: boolean = false;
  private showPlayList: boolean = false;

  //音乐播放时间
  private currentTime: number = 0;
  private endTime: number = 0;

  author: string = "";
  name: string = "";
  cover: string = "";

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

  public changeVolum(value: number): void {
    this.volum = value;
  }

  //播放状态改变时调用
  public stateChange(): void {
    //改变播放状态
    this.$store.commit(CHANGE_PLAY_STATE);

    let tPlayState = this.$store.state as StateInterface;

    if (tPlayState.currentPlayIndex === -1) {
      return;
    } else if (!this.$store.state.music.src) {
      this.$store.state.music.src =
        tPlayState.playList[tPlayState.currentPlayIndex];
    }

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
          if (this.$store.state.playList.length !== 0)
            tPlayMode.autoPlay(this.$store.state);
        }
        //计算百分比, 0 ~ 100
        this.progress = computedPercent(this.currentTime++, this.endTime);
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

  public modeChange(): void {
    this.$store.commit(CHANGE_PLAY_MODE);
  }
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

      .music-desc {
        display: inline-block;
        .cover {
        }
        .name {
        }
        .author {
        }
      }

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
      margin: 10px 0;
    }

    .btn {
      background-repeat: no-repeat;
      vertical-align: middle;
      width: 45px;
      height: 45px;

      &.hidden {
        position: absolute;
        right: 0px;
        top: 0px;
        color: $--color-primary;
      }

      &:hover {
        cursor: pointer;
      }
    }

    .small-btn {
      @extend .btn;
      width: 35px;
      height: 35px;
      line-height: 30px;
      padding: 0px 5px;
    }

    .volum {
      display: inline-block;
      width: 30px;
      padding: 0px 5px;
      position: relative;

      @keyframes show {
        0% {
          clip-path: inset(100% 0px 0px 0px);
        }
        20% {
          clip-path: inset(80% 0px 0px 0px);
        }
        40% {
          clip-path: inset(60% 0px 0px 0px);
        }
        60% {
          clip-path: inset(40% 0px 0px 0px);
        }
        80% {
          clip-path: inset(20% 0px 0px 0px);
        }
        100% {
          clip-path: inset(0px 0px 0px 0px);
        }
      }

      .volum-fade-out-enter-active {
        animation: {
          name: show;
          duration: 0.3s;
          timing-function: ease-out;
        }
      }

      .volum-fade-out-leave-active {
        @extend .volum-fade-out-enter-active;
        animation-direction: reverse;
      }

      img {
        width: 30px;
        height: 30px;
        padding: 0px;
      }

      .el-slider {
        display: inline-block;
        height: 90px;
        padding: {
          top: 10px;
          bottom: 15px;
        }
        position: absolute;
        top: -130px;
        background: white;
        border: 2px solid $--color-primary;
        border-bottom: none;
        right: 0.5px;
      }
    }

    .play {
      width: 60px;
      height: 60px;
    }
  }
}
</style>