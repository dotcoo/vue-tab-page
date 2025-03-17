import { createWebHashHistory, createRouter } from 'vue-router';
import { useTabs } from './index';

import Home from './Home.vue';

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { title: '首页' } },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.afterEach((to, from, failure) => {
  useTabs().add(to);
});
