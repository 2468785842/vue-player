import BeanUtils from "@utils/BeanUtils";
import { StateInterface } from "./state";

/**
 * 将共同方法抽象出来
 */
abstract class PlayModeContext {
  public abstract autoPlay(state: StateInterface): void;

  public static resetMusic(state: StateInterface) {
    state.music.src = state.playList[state.currentPlayIndex].url;
    state.playState === 'play' && state.music.play();
  }

}

@BeanUtils.Bean('loop-list')()
class LoopListMode extends PlayModeContext {

  public autoPlay(state: StateInterface) {
    let index: number = state.currentPlayIndex++;
    if (index >= state.playList.length) {
      index = 0;
    }
    PlayModeContext.resetMusic(state);
  }

}

@BeanUtils.Bean('random')()
class RadomMode extends PlayModeContext {

  autoPlay(state: StateInterface) {
    let index: number | undefined = undefined;

    do {
      index = Math.random() * 100 % (state.playList.length - 1);
    } while (index && index !== state.currentPlayIndex);
    state.currentPlayIndex = index;
    PlayModeContext.resetMusic(state);
  }
}

@BeanUtils.Bean('loop')()
class LoopMode extends PlayModeContext {

  autoPlay(state: StateInterface) {
    PlayModeContext.resetMusic(state);
  }

}

export {
  PlayModeContext,
  RadomMode,
  LoopMode,
  LoopListMode
};
