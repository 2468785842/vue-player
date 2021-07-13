import { mutations } from '@store/mutations';
import { state } from '@store/state';
import Vuex from 'vuex';
import { PlayModeContext } from './PlayMode';
import Vue from "vue";
import BeanUtils from '@utils/BeanUtils';

Vue.use(Vuex);

const store = new Vuex.Store({
  state,
  mutations,
  getters: {
    playMode(state): PlayModeContext {
      console.log(state.playMode);
      return BeanUtils.getBean(state.playMode);
    }
  }
});

export {
  store
};

