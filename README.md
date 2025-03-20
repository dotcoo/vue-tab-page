# vue-tab-page

[English](./README.md) [中文](README.zh-CN.md)

## main.js

```
...
import { createTabs } from 'vue-tab-page';
...

createApp(App)
  .use(router) // 先注册 vue-router
  .use(createTabs())
  .mount('#app');
