import BeanUtils from "@utils/BeanUtils";
import { StateInterface } from "./state";

/**
 * 将共同方法抽象出来
 */
abstract class PlayModeContext {
  public abstract autoPlay(state: StateInterface): void;

  protected resetMusic(state: StateInterface, src: string): void {
    state.music.pause();
    state.music.currentTime = 0;
    state.music.src = src;
    state.music.play();
  }
}

@BeanUtils.Bean('loop-list')()
class LoopListMode extends PlayModeContext {

  public autoPlay(state: StateInterface) {
    let index: number = state.currentPlayIndex++;
    if (index >= state.playList.length) {
      index = 0;
    }
    this.resetMusic(state, state.playList[index].url);
  }

}

@BeanUtils.Bean('random')()
class RadomMode extends PlayModeContext {

  autoPlay(state: StateInterface) {
    let index: number | undefined = undefined;

    do {
      index = Math.random() * 100 % (state.playList.length - 1);
    } while (index && index !== state.currentPlayIndex);

    this.resetMusic(state, state.playList[index].url);
  }
}

@BeanUtils.Bean('loop')()
class LoopMode extends PlayModeContext {

  autoPlay(state: StateInterface) {
    this.resetMusic(state, state.playList[state.currentPlayIndex].url);
  }

}

export {
  PlayModeContext,
  RadomMode,
  LoopMode,
  LoopListMode
};
