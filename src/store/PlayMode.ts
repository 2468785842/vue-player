import { StateInterface } from "./state";

abstract class PlayModeContext {
  public mode?: string;
  protected state: StateInterface;
  private music: HTMLAudioElement;

  constructor(state: StateInterface, music: HTMLAudioElement) {
    this.state = state;
    this.music = music;
  }

  public abstract autoPlay(): void;

  protected resetMusic(src: string): void {
    this.music.pause();
    this.music.currentTime = 0;
    this.music.src = src;
    this.music.play();
  }
}

class LoopListMode extends PlayModeContext {
  mode: string = 'loop-list';

  public autoPlay(): void {
    let index: number = this.state.currentPlayIndex++;
    if (index >= this.state.playList.length) {
      index = 0;
    }
    this.resetMusic(this.state.playList[index].url);
  }

}

class RadomMode extends PlayModeContext {
  mode: string = 'radom';

  autoPlay(): void {
    let index: number | undefined = undefined;

    do {
      index = Math.random() * 100 % (this.state.playList.length - 1);
    } while (index && index !== this.state.currentPlayIndex);

    this.resetMusic(this.state.playList[index].url);
  }
}


class LoopMode extends PlayModeContext {
  mode: string = 'loop';

  autoPlay(): void {
    this.resetMusic(this.state.playList[this.state.currentPlayIndex].url);
  }
}

export {
  PlayModeContext,
  RadomMode,
  LoopMode,
  LoopListMode
};
