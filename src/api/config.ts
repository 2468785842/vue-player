import axios from 'axios';
import { Message } from 'element-ui';

axios.defaults.baseURL = 'http://localhost:3000';

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  Message.error({ message: '请求超时!' });
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  Message.error({ message: '服务器无响应!' });
  return Promise.reject(error);
});