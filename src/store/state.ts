import { Music } from '@model/Music';

type PlayState = "pause" | "play";
type PlayMode = "loop" | "random" | "loop-list";

const state: StateInterface = {
  playMode: 'loop-list',
  playState: 'pause',
  playList: [],
  currentPlayIndex: -1,
  music: new Audio()
};

interface StateInterface {
  //播放模式
  playMode: PlayMode;
  //播放状态
  playState: PlayState;
  //播放列表
  playList: Music[];
  //当前播放的音乐索引
  currentPlayIndex: number;
  music: HTMLAudioElement;
}

export {
  state,
  StateInterface
};