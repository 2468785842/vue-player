import { transformNumberToC } from '@utils/MusicUtils';

test('test transformNumberToC', () => {
  expect(transformNumberToC(11000, '个')).toEqual('1万1千');
  expect(transformNumberToC(11100, '个')).toEqual('1万1千100');
  expect(transformNumberToC(11001, '个')).toEqual('1万1千001');
  expect(transformNumberToC(111000, '个')).toEqual('11万1千');
  expect(transformNumberToC(1111000, '个')).toEqual('111万1千');
  expect(transformNumberToC(11111000, '个')).toEqual('1111万1千');
  expect(transformNumberToC(111111000, '个')).toEqual('1亿1111万1千');


  expect(transformNumberToC(111001, '千')).toEqual('11万1千');
  expect(transformNumberToC(111001, '个')).toEqual('11万1千001');
  
  expect(transformNumberToC(111001)).toEqual('11万');
});