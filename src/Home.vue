<template>
  <div>
    <h2>{{ route.fullPath }}</h2>
    <p><input v-model="value" /></p>
    <p><button @click="toNewTab">new tab</button></p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTab, onTabMounted, onTabActivated, onTabDeactivated, onTabBeforeUnmount } from './index';

const router = useRouter();
const route = useRoute();

const tab = useTab();

const value = ref(Math.random());

const toNewTab = async () => {
  router.push({ name: 'Home', query: { id: Date.now() } });
};

onTabMounted(() => {
  tab.title = tab.meta.title + tab.query.id;
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
