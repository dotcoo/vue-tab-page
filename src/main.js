import { createApp } from 'vue';
import { router } from './router';
import { createTabs } from './index';
import App from './App.vue';

window.incrid = 0;

createApp(App)
  .use(router)
  .use(createTabs())
  .mount('#app');
