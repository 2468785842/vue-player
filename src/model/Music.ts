
/**
 * 音乐
 */
class Music {

  id: number;
  url: string;
  name: string;
  picUrl: string | null;

  album?: string;
  singer?: string;
  playCount?: string;
  trackNumberUpdateTime?: string;
  copywriter?: string;

  constructor(
    id: number,
    name: string,
    url: string,
    picUrl: string,
  ) {
    this.id = id;
    this.url = url;
    this.name = name;
    this.picUrl = picUrl;
  }


}

export {
  Music
};