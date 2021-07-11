import { mutations } from '@store/mutations';
import { state } from '@store/state';
import Vuex from 'vuex';
import { LoopListMode, LoopMode, PlayModeContext, RadomMode } from './PlayMode';
import Vue from "vue";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    ...state,
    music: new Audio()
  },
  mutations,
  getters: {
    playMode: (state): PlayModeContext => {
      //单曲循环
      if (state.playMode === 'loop') {
        return new LoopMode(state, state.music);
      }
      //随机循环
      else if (state.playMode === 'random') {
        return new RadomMode(state, state.music);
      }
      //列表循环，系统缺省
      return new LoopListMode(state, state.music);
    }
  }
});

export {
  store
};

