import { Music } from "@model/Music";
import { MusicList } from "@model/MusicList";
import { Api } from '@services';

//包装歌单对象
export async function wrapperMusicList(list: any[]) {
  const tList: MusicList[] = [];

  for (const item of list) {

    tList.push(new MusicList(
      item.id, item.name, item.picUrl,
      item.copywriter, item.trackNumberUpdateTime,
      item.playCount
    ));
  }

  return tList;
}

//包装歌曲对象
export async function wrapperMusic(list: any[]) {
  const tList: Music[] = [];

  for (const item of list) {

    const al = await Api.getMusicDetail(item.id);
    const url = await Api.getMusicURL(item.id) as string;

    //chargeInfoList
    const music: Music = new Music(
      item.id, al.name, url, al.picUrl
    );

    music.singer = item.singer;
    music.cover = item.cover;
    console.log(JSON.stringify(music));
    tList.push(music);
  }

  return tList;

}