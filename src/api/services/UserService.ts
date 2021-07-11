import axios from 'axios';
import { User } from '@common/userInfo';

const UserService = {
  //登录
  async login(phone: string, password: string): Promise<User> {
    const response: any = await axios.get(`/login/cellphone`, {
      params: {
        phone, password
      }
    });
    console.log(JSON.stringify(response));
    return {
      uid: response.data.profile.userId,
      cookie: response.data.cookie
    };
  },
  /**
   * @method 获取用户播放记录
   * @params user 用户
   * @params type 1只返回,这周记录. 0返回,所有记录
   */
  async getUserRecord(user: User, type: 0 | 1): Promise<any> {
    const response: any = await axios.get('/user/record', {
      params: {
        uid: user.uid,
        cookie: encodeURIComponent(user.cookie),
        type
      }
    });
    return response;
  }
};

export {
  UserService
};