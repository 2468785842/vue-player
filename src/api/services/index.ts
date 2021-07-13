import { User } from '@common/userInfo';
import { Music } from '@model/Music';
import { MusicList } from '@model/MusicList';
import { wrapperMusic, wrapperMusicList } from '@utils/ModelUtils';

import axios from 'axios';

//获取推荐歌单默认5条
async function getPersonalized(limit: number = 5, user?: User): Promise<MusicList[]> {
  const params: any = { limit };
  if (user) {
    params.cookie = user.cookie;
  }
  const response: any = await axios.get(`/personalized`, { params });
  return await wrapperMusicList(response.data.result);
}

//获取歌单中的音乐
async function getMusicList(id: number): Promise<Music[]> {
  const response: any = await axios.get('/playlist/detail', {
    params: { id }
  });

  return await wrapperMusic(response.data.privileges);
}

//获取歌曲详细信息
async function getMusicDetail(ids: number): Promise<{ picUrl: string, name: string; }> {
  const response: any = await axios.get('/song/detail', {
    params: { ids }
  });

  return response.data.songs[0].al;
}

//获取推荐歌单
async function getRecommendMusic(): Promise<Music[]> {
  const response: any = await axios.get('/personalized/newsong');
  return await wrapperMusic(response.data.result);
}


/**
 * 获取音乐url
 * @param id 音乐id
 * @param br 码率
 */
async function getMusicURL(id: string[], br?: string): Promise<string[] | string> {

  const sList: string[] = [];
  const params: any = { id };

  if (br) params.br = br;

  const response: any = await axios.get('/song/url', { params });

  for (const item of response.data.data) {
    sList.push(item.url);
  }

  return sList.length === 1 ? sList[0] : sList;
}

export const Api = {
  getPersonalized,
  getMusicURL,
  getMusicList,
  getMusicDetail,
  getRecommendMusic
};