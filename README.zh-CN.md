# vue-tab-page

[English](README.md) [中文](README.zh-CN.md)

## 预览

![vue-tab-page preview](preview.jpg)

## 使用说明

### main.js

```js
import { createApp } from 'vue';
import { router } from './router';
import { createTabPage } from 'vue-tab-page';
import App from './App.vue';

createApp(App)
  .use(router)
  .use(createTabPage(), { router, blank: { name: 'Blank' } }) // 创建并注册 vue-tab-page.
  .mount('#app');
```

### App.vue

```vue
<template>
  <!-- 标签页切换栏. -->
  <vue-tab-page-bar>
    <template v-slot="{ tab, index }">
      <div @click="tab.active()" :class="{ active: tab.fullPath == $route.fullPath }">
        <div>{{tab.title}}</div>
        <div @click.stop="tab.refresh()">Refresh</div>
        <div @click.stop="tab.close('right')">Close</div>
      </div>
    </template>
  </vue-tab-page-bar>
  <!-- 标签页内容. -->
  <vue-tab-page-content></vue-tab-page-content>
</template>
```

### Page.vue

```vue
<template>
  <div>
    <h1>{{ route.fullPath }} Page</h1>
    <hr />
    <p><input v-model="input" /></p>
    <p style="display: flex; gap: 10px;">
      <button @click="push">router.push</button>
      <button @click="replace">router.replace</button>
      <button @click="back">router.back</button>
      <button @click="forward">router.forward</button>
    </p>
    <p style="display: flex; gap: 10px;">
      <button @click="close">router.close</button>
    </p>
    <hr />
    <p><button @click="onLogout">logout</button></p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTab, onTabMounted, onTabActivated, onTabDeactivated, onTabBeforeUnmount } from 'vue-tab-page';

const router = useRouter();
const route = useRoute();

const input = ref(null);

// 获取当前标签栏信息.
const tab = useTab();

// 打开新标签.
const push = async () => {
  router.push({ name: 'Page', query: { id: Date.now() }, state: { data: [{a:1}] } });
};

// 替换当前标签.
const replace = async () => {
  router.replace({ name: 'Page', query: { id: Date.now() }, state: { data: [{a:1}] } });
};

// 后退.
const back = async () => {
  router.back();
};

// 前进.
const forward = async () => {
  router.forward();
};

// 刷新.
const refresh = () => {
  tab.refresh();
};

// 关闭当前标签并返回.
const close = () => {
  tab.close('back');
};

// 标签页打开时.
onTabMounted(() => {
  tab.title = tab.meta.title + tab.query.id;
  input.value = Math.random();
  console.log(tab.query.id, 'onMounted');
});

// 标签页显示时.
onTabActivated(() => {
  console.log(tab.query.id, 'onActivated');
});

// 标签页隐藏时.
onTabDeactivated(() => {
  console.log(tab.query.id, 'onDeactivated');
});

// 标签页销毁时.
onTabBeforeUnmount(() => {
  console.log(tab.query.id, 'onBeforeUnmount');
});

const onLogout = () => {
  localStorage.removeItem('token');
  router.push({ name: 'Login' });
};
</script>
```
