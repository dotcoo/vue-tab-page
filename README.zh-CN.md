# vue-tab-page

[English](README.md) [中文](README.zh-CN.md)

## 使用说明

## main.js

```js
import { createApp } from 'vue';
import { router } from './router';
import { createTabs } from 'vue-tab-page';
import App from './App.vue';

createApp(App)
  .use(router) // 先注册 vue-router.
  .use(createTabs()) // 然后注册 vue-tab-page. 参数1: 如果关闭所有标签页, 会跳转到 Blank 路由, 如 `{ name: 'Blank' }`
  .mount('#app');
```

## router.js

```js
import { createWebHashHistory, createRouter } from 'vue-router';
import { useTabs } from 'vue-tab-page';

import Blank from './views/Blank.vue';
import Page from './views/Page.vue';

const routes = [
  { path: '/', name: 'Home', redirect: { name: 'Page', query: { id: 0 } } },
  { path: '/blank', name: 'Blank', component: Blank, meta: { title: '空白页' } },
  { path: '/page', name: 'Page', component: Page, meta: { title: '页面' } },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.afterEach((to, from, failure) => {
  useTabs().add(to); // 新路由添加到标签页中
});
```

## App.vue

```vue
<template>
  <div>
    <div style="cursor: pointer;">
      <span v-for="tab in tabs.items" :key="tab.fullPath" @click="tab.active()" :style="{ backgroundColor: tab.fullPath == $route.fullPath ? '#ccc': '#fff' }">
        <span>&emsp;{{tab.title}}&emsp;</span>
        <span @click.stop="tab.refresh()">刷新&emsp;</span>
        <span @click.stop="tab.close()">关闭&emsp;</span>
      </span>
    </div>
    <div>
      <router-view v-slot="{ route, Component }">
        <keep-alive :include="tabs.include.value">
          <component :is="route.component" :component="Component" :key="route.fullPath" />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeMount } from 'vue';
import { useTabs } from 'vue-tab-page';

const tabs = useTabs(); // 获取标签页

onMounted(() => tabs.start()); // 开启标签页
onBeforeMount(() => tabs.stop()); // 关闭标签页
</script>
```

### Page.vue

```vue
<template>
  <div>
    <h2>{{ route.fullPath }}</h2>
    <p><input v-model="input" /></p>
    <p><button @click="toNewTab">new tab</button></p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTab, onTabMounted, onTabActivated, onTabDeactivated, onTabBeforeUnmount } from 'vue-tab-page';

const router = useRouter();
const route = useRoute();

const tab = useTab();

const input = ref(null);

const toNewTab = async () => {
  router.push({ name: 'Page', query: { id: Date.now() } });
};

onTabMounted(() => {
  tab.title = tab.meta.title + tab.query.id;
  input.value = Math.random();
  console.log(tab.query.id, 'onMounted');
});

onTabActivated(() => {
  console.log(tab.query.id, 'onActivated');
});

onTabDeactivated(() => {
  console.log(tab.query.id, 'onDeactivated');
});

onTabBeforeUnmount(() => {
  console.log(tab.query.id, 'onBeforeUnmount');
});
</script>
```
