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
import { useTab, onTabMounted, onTabActivated, onTabDeactivated, onTabBeforeUnmount } from '../../lib';

const router = useRouter();
const route = useRoute();

const tab = useTab();

const input = ref(null);

// 打开新标签
const push = async () => {
  router.push({ name: 'Page', query: { id: Date.now() }, state: { data: [{a:1}] } });
};

// 替换标签
const replace = async () => {
  router.replace({ name: 'Page', query: { id: Date.now() }, state: { data: [{a:1}] } });
};

// 后退
const back = async () => {
  router.back();
};

// 前进
const forward = async () => {
  router.forward();
};

// 关闭标签 并返回
const close = () => {
  tab.close();
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

const onLogout = () => {
  localStorage.removeItem('token');
  router.push({ name: 'Login' });
};
</script>
