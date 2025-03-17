<template>
  <div>
    <div class="tabs">
      <div v-for="tab in tabs.items" :key="tab.fullPath" @click="tab.active()" :class="{ active: tab.fullPath == $route.fullPath }">
        <div>{{tab.title}}</div>
        <div @click.stop="tab.refresh()">刷新</div>
        <div @click.stop="tab.close()">关闭</div>
      </div>
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
import { useTabs } from './index';

const tabs = useTabs();

onMounted(() => tabs.start());
onBeforeMount(() => tabs.stop());
</script>

<style scoped>
.tabs {
  display: flex;
  column-gap: 8px;
  border-bottom: 1px solid #ccc;
  >div {
    padding: 4px 10px;
    display: flex;
    column-gap: 8px;
    cursor: pointer;
    border-right: 1px solid #ccc;
    &.active {
      background-color: #ccc;
    }
  }
}
</style>