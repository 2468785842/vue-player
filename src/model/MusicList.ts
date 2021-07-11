/**
 * 歌单
 */
class MusicList {

  id: number;
  name: string;
  picUrl: string;
  playCount: string;
  trackNumberUpdateTime: string;
  copywriter: string;

  constructor(
    id: number,
    name: string,
    picUrl: string,
    copywriter: string,
    trackNumberUpdateTime: string,
    playCount: string
  ) {
    this.id = id;
    this.name = name;
    this.picUrl = picUrl;
    this.copywriter = copywriter;
    this.trackNumberUpdateTime = trackNumberUpdateTime;
    this.playCount = playCount;
  }


}

export {
  MusicList
};