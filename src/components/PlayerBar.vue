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
          :src="playStateIcon[$store.state.playState]"
          class="btn play"
          @click="$store.commit(CHANGE_PLAY_STATE)"
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
          <el-image class="cover" :src="cover" fit="cover" lazy>
            <div slot="error" style="height: inherit">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <div class="info">
            <div class="name">{{ name }}</div>
            <div class="singer">{{ singer }}</div>
          </div>
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
              v-show="showVolume"
              v-model="volume"
              :show-tooltip="false"
              @input="changeVolume"
            ></el-slider>
          </transition>
          <img
            src="@/assets/svg/player-bar/right/volum.svg"
            class="small-btn"
            @click="showVolume = !showVolume"
            title="音量"
          />
        </div>
        <img
          :src="playModeIcon[$store.state.playMode]"
          class="small-btn"
          @click="$store.commit(CHANGE_PLAY_MODE)"
        />
        <img
          src="@/assets/svg/player-bar/right/play-list.svg"
          class="small-btn"
          @click="showPlayList = !showPlayList"
          title="播放列表"
        />
        <div class="hidden btn" @click="thisShow = !thisShow">
          <i class="el-icon-arrow-down"></i>
        </div>
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
import { Music } from "@model/Music";

import { StateInterface } from "@store/state";
import {
  CHANGE_PLAY_MODE,
  CHANGE_PLAY_STATE,
  PLAY_NEXT_MUSIC,
  PLAY_PREVIOUS_MUSIC,
} from "@store/type";
import { computedPercent, secondToMinute } from "@utils/MusicUtils";
import { Slider } from "element-ui";
import { Component, Vue, Watch } from "vue-property-decorator";

@Component({
  data() {
    return {
      secondToMinute,
      CHANGE_PLAY_STATE,
      CHANGE_PLAY_MODE,
      playStateIcon: {
        pause: PlaySvg,
        play: PauseSvg,
      },
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

  progress: number = 0; //0 ~ 100, 当前音乐播放进度百分比

  volume: number = 0;

  showVolume: boolean = false;
  showPlayList: boolean = false;
  thisShow: boolean = true;

  //音乐播放时间
  private currentTime: number = 0;
  private endTime: number = 0;

  singer: string = "未知";
  name: string = "未知";
  cover: string = "";

  @Watch("$store.state.currentPlayIndex")
  @Watch("$store.state.playList")
  public watchCurrentPlayIndex(newValue: number | Music[]) {
    this.currentTime = 0; //改变显示信息

    if (typeof newValue !== "number") {
      return;
    }
    const tPlayState: StateInterface = this.$store.state;

    this.cover = tPlayState.playList[newValue].picUrl ?? "";
    this.name = tPlayState.playList[newValue].name;
    this.singer = tPlayState.playList[newValue].singer ?? "未知";

    // this.stateChange(false);
  }

  //在这初始化某些事件
  public mounted() {
    const tPlayState: StateInterface = this.$store.state;

    this.volume = 100;
    //当持续时间改变时
    tPlayState.music.addEventListener("durationchange", () => {
      this.endTime = tPlayState.music.duration;
    });

    tPlayState.music.addEventListener("volumechange", () => {
      this.volume = tPlayState.music.volume * 100;
    });

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
        this.$store.commit(CHANGE_PLAY_STATE);
      }
    });
  }

  //松开进度条按钮时
  public change() {
    //只有在抬起之后才应用快进的时间
    this.applayTimeToMusic();
    if (this.$store.state.playMode !== "pause") {
      this.autoMoveProgress();
    }
  }

  //按下进度条时
  public down() {
    this.stopAutoMoveProgress();
  }

  public input(value: number) {
    if (!this.autoMove) {
      this.currentTime = (value / 100) * this.endTime;
    }
  }

  //播放状态改变时调用
  @Watch("$store.state.playState")
  public stateChange() {
    const tState: StateInterface = this.$store.state;

    if (tState.currentPlayIndex === -1 || tState.playList.length < 1) {
      console.log("no have music");
      return;
    }

    if (!tState.music.src) {
      tState.music.src = tState.playList[tState.currentPlayIndex].url;
    }

    tState.music[tState.playState](); //通过key动态执行function

    if (tState.playState === "pause") {
      this.stopAutoMoveProgress();
    } else {
      this.autoMoveProgress();
    }
  }

  //只是移动进度条，不会对音乐播放做任何事
  private autoMoveProgress() {
    if (!this.autoMove) {
      //异步任务
      this.autoMove = window.setInterval(() => {
        //计算百分比, 0 ~ 100
        this.progress = computedPercent(this.currentTime++, this.endTime);

        //播放一首歌曲完毕时
        if (this.currentTime >= this.endTime) {
          this.progress = 0;
          this.currentTime = 0;
          console.log("歌曲播放完毕");
          //根据播放模式自动选择下一首
          this.$store.getters.playMode.autoPlay(this.$store.state);
        }
      }, 1000);
    }
  }

  private stopAutoMoveProgress() {
    if (this.autoMove) {
      window.clearInterval(this.autoMove);
      this.autoMove = undefined;
    }
  }

  // 应用进度条的时间到音乐
  private applayTimeToMusic() {
    //music加载了音乐
    if (this.$store.state.music.src) {
      this.$store.state.music.currentTime = this.currentTime;
    }
  }

  //============================//

  //下一首
  public previous() {
    this.$store.commit(PLAY_PREVIOUS_MUSIC);
    console.log("previous...");
  }

  //上一首
  public next() {
    this.$store.commit(PLAY_NEXT_MUSIC);
    console.log("next...");
  }

  public changeVolume(value: number) {
    this.$store.state.music.volume = value / 100;
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
  z-index: 2;

  .content {
    width: 1100px;
    margin: 0px auto;

    .middle {
      display: inline-block;
      line-height: $frame-height;

      .music-desc {
        float: left;
        font-size: 10px;
        height: $frame-height;

        .cover {
          outline: 1px solid $--color-primary;
          height: 50px;
          width: 50px;
          float: left;
          top: 5px;
        }

        .info {
          float: right;
          width: 75px;
          line-height: initial;
          position: relative;
          top: 10px;
          padding: 0px 10px;

          .name,
          .singer {
            text-align: left;
            width: inherit;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          .name {
            font-size: 13px;
            padding-bottom: 5px;
          }

          .singer {
            font-size: 10px;
            color: gray;
          }
        }

        &::after {
          display: block;
          content: "";
          clear: both;
          width: 0px;
          height: 0px;
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
      height: $frame-height;
    }
  }
}
</style>