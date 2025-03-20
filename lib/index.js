import { tabPageKey, Tab, TabPage, useTabPage, useTab, onTabMounted, onTabActivated, onTabDeactivated, onTabBeforeUnmount } from './TabPage';
import TabPageBar from './TabPageBar.vue';
import TabPageContent from './TabPageContent.vue';

const createTabPage = () => {
  return {
    install: (app, options = null) => {
      app.provide(tabPageKey, new TabPage(options));
      app.component('VueTabPageBar', TabPageBar);
      app.component('VueTabPageContent', TabPageContent);
    },
  };
};

export {
  createTabPage,
  // tabPageKey,
  // Tab,
  // TabPage,
  useTabPage,
  useTab,
  onTabMounted,
  onTabActivated,
  onTabDeactivated,
  onTabBeforeUnmount,
};
