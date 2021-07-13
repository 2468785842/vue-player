import '@/styles.scss';

import Vue from 'vue';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/zh-CN.js';

import App from '@/App.vue';
import { store } from '@store';
import * as config from '@api/config';
import router from './router';
import * as PlayMode from "@store/PlayMode";

Vue.use(ElementUI, { locale });
Vue.config.productionTip = false;

config;
PlayMode;

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app');
