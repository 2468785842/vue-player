import { StateInterface } from "@store/state";
import { CHANGE_PLAY_MODE, CHANGE_PLAY_STATE } from "@store/type";
import { MutationTree } from 'vuex';

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
  }
};



export {
  mutations
};
