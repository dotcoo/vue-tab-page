<template>
  <div class="vue-tab-page-bar">
    <template v-for="(tab, index) in tabPage.items" :key="tab.fullPath">
      <slot :tab="tab" :index="index"></slot>
    </template>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { useTabPage } from './TabPage';
const tabPage = useTabPage();
onMounted(() => tabPage.enable());
onBeforeUnmount(() => tabPage.disable());
</script>
