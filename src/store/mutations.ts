import { StateInterface } from "@store/state";
import {
  PLAY_NEXT_MUSIC, PLAY_PREVIOUS_MUSIC,
  CHANGE_PLAY_MODE, CHANGE_PLAY_STATE
} from "@store/type";
import { MutationTree } from 'vuex';
import { PlayModeContext } from "./PlayMode";

const mutations: MutationTree<StateInterface> = {
  [CHANGE_PLAY_STATE](s: StateInterface) {
    if (s.playState === 'pause') {
      s.playState = 'play';
    } else {
      s.playState = 'pause';
    }
  },
  [CHANGE_PLAY_MODE](s: StateInterface) {
    if (s.playMode === 'loop-list') {
      s.playMode = 'random';
    } else if (s.playMode === 'random') {
      s.playMode = 'loop';
    } else {
      s.playMode = 'loop-list';
    }
  },
  [PLAY_NEXT_MUSIC](s: StateInterface) {
    console.log('下一首');
    s.currentPlayIndex++;
    if (s.currentPlayIndex >= s.playList.length) {
      s.currentPlayIndex = 0;
    }
    PlayModeContext.resetMusic(s);
  },
  [PLAY_PREVIOUS_MUSIC](s: StateInterface) {
    s.currentPlayIndex--;
    if (s.currentPlayIndex < 0) {
      s.currentPlayIndex = s.playList.length - 1;
    }
    PlayModeContext.resetMusic(s);
  }
};



export {
  mutations
};
