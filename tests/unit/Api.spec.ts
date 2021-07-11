import { Music } from '@model/Music';
import { Api } from '@services';
import * as config from '@api/config';
import { MusicList } from '@model/MusicList';

config;
// 测试获取音乐
describe('test music interface', () => {

  it('get music personalized', async () => {
    const musicLists: MusicList[] = await Api.getPersonalized();

    for (const item of musicLists) {
      const musics: Music[] = await Api.getMusicList(item);

      for (const item of musics) {
        console.log('music: ' + JSON.stringify(item));
      }
    }
  }, 100000);

});