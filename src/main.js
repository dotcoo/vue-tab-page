import { createApp } from 'vue';
import { router } from './router';
import { createTabPage } from '../lib';
import App from './App.vue';

createApp(App)
  .use(router)
  .use(createTabPage(), { router, blank: { name: 'Blank' } }) // Create and Register vue-tab-page. 创建并注册 vue-tab-page.
  .mount('#app');
