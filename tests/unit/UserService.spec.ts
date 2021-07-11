import { UserService } from '@api/services/UserService';
import { User } from '@common/userInfo';
import * as config from '@api/config';

config;

const phone = process.env.phone;
const password = process.env.password;
let tUser: User;

beforeAll(async () => {
  tUser = await UserService.login(phone, password);
  console.log(JSON.stringify(tUser));
});

describe('test user', () => {
  it('login success', () => {
    expect(tUser).toBeDefined();
    expect(tUser).not.toEqual({});
  });

  it('get user record', async () => {
    const response: any = await UserService.getUserRecord(tUser, 0);
    console.log(JSON.stringify(response));
  });

});