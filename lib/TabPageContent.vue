<template>
  <div class="vue-tab-page-content">
    <router-view v-slot="{ route, Component }">
      <keep-alive :include="tabPage.items.map(v => v.component.name)">
        <component :is="route.component" :component="Component" :key="route.fullPath" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup>
import { useTabPage } from './TabPage';
const tabPage = useTabPage();
</script>
