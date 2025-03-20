import { createApp } from 'vue';
import { router } from './router';
import { createTabPage } from '../lib';
import App from './App.vue';

createApp(App)
  .use(router)
  .use(createTabPage(), { router, blank: { name: 'Blank' } }) // 创建并注册 vue-tab-page, 如果关闭了所有标签页跳转到 blank 路由, 可选
  .mount('#app');
