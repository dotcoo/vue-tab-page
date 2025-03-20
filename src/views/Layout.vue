<template>
  <vue-tab-page-bar>
    <template v-slot="{ tab, index }">
      <div @click="tab.active()" :class="{ active: tab.fullPath == $route.fullPath }">
        <div>{{tab.title}}</div>
        <div @click.stop="tab.refresh()">刷</div>
        <div @click.stop="tab.close('right')">关</div>
      </div>
    </template>
  </vue-tab-page-bar>
  <vue-tab-page-content></vue-tab-page-content>
</template>

<style>
.vue-tab-page-bar {
  display: flex;
  column-gap: 4px;
  border-bottom: 1px solid #9ad7fe;
  > div {
    cursor: pointer;
    display: flex;
    column-gap: 10px;
    padding: 4px 16px;
    color: #333;
    background: #f0f0f0;
    border-radius: 8px 8px 0 0;
    &.active {
      color: #fff;
      background: #9ad7fe;
    }
  }
}
</style>
