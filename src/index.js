import { inject, reactive, computed, markRaw, defineComponent, h, onMounted, onBeforeUnmount, onActivated, onDeactivated } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const tabsKey = Symbol(import.meta.env.DEV ? 'tabs' : '');

export class Tabs {
  blank = null;
  router = null;
  incrid = 0;
  items = [];
  include = [];
  runing = false;

  constructor(blank = null) {
    this.blank = blank;
    this.items = reactive([]);
    this.include = computed(() => this.items.map(v => v.componentName));
  }

  start() {
    this.items.splice(0);
    this.runing = true;
  }

  stop() {
    this.runing = false;
  }

  add(route) {
    if (!this.runing) { return; }
    let i = this.items.findIndex(v => v.fullPath == route.fullPath), tab = this.items[i];
    if (i == -1) {
      const componentName = 'TabComponent' + ++this.incrid;
      const component = markRaw(defineComponent({ name: componentName, setup: (_, { attrs, slots }) => () => h(attrs.component, _, slots) }));
      tab = {
        // route
        name: route.name,
        href: route.href,
        fullPath: route.fullPath,
        path: route.path,
        params: { ...route.params },
        query: { ...route.query },
        hash: route.hash,
        matched: [],
        meta: { ...route.meta },
        // prop
        fullPath: route.fullPath,
        title: route.meta.title || '',
        componentName,
        component,
        // method
        active: () => this.active(tab),
        refresh: () => this.refresh(tab),
        close: () => this.close(tab),
        // event
        onMounted: null,
        onActivated: null,
        onDeactivated: null,
        onBeforeUnmount: null,
        mounted: () => tab.onMounted?.(),
        activated: () => tab.onActivated?.(),
        deactivated: () => tab.onDeactivated?.(),
        beforeUnmount: () =>tab.onBeforeUnmount?.(),
      };
      this.items.push(tab);
    }
    route.component = tab.component;
  }

  active(tab) {
    this.router.push(tab);
  }

  async refresh(tab) {
    await tab.deactivated();
    await tab.beforeUnmount();
    await tab.mounted();
    await tab.activated();
  }

  close(tab) {
    const i = this.items.findIndex(v => v.fullPath == tab.fullPath);
    if (i == -1) { return; }
    this.items.splice(i, 1);
    const active = this.items[i+1] ?? this.items[i-1] ?? this.blank;
    if (!active) { return; }
    this.router.push(active);
  }

  install(app) {
    this.router = app.runWithContext(() => useRouter());
    app.provide(tabsKey, this);
  }
}

export const createTabs = (blank = null) => {
  return new Tabs(blank);
};

export const useTabs = () => {
  return inject(tabsKey);
};

export const useTab = (route = useRoute()) => {
  return useTabs().items.find(v => v.fullPath == route.fullPath);
};

export const onTabMounted = (callback, tab = useTab()) => {
  if (!tab) { return; }
  tab.onMounted = callback;
  onMounted(() => tab.mounted());
};

export const onTabActivated = (callback, tab = useTab()) => {
  if (!tab) { return; }
  tab.onActivated = callback;
  onActivated(() => tab.activated());
};

export const onTabDeactivated = (callback, tab = useTab()) => {
  if (!tab) { return; }
  tab.onDeactivated = callback;
  onDeactivated(() => tab.deactivated());
};

export const onTabBeforeUnmount = (callback, tab = useTab()) => {
  if (!tab) { return; }
  tab.onBeforeUnmount = callback;
  onBeforeUnmount(() => tab.beforeUnmount());
};
