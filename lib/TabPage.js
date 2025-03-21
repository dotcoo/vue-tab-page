import { inject, reactive, markRaw, defineComponent, h, onMounted, onBeforeUnmount, onActivated, onDeactivated } from 'vue';

const tabPageKey = Symbol(import.meta.env.DEV ? 'tabPage' : '');

class Tab {
  constructor(route) {
     // route
    this.name = route.name;
    this.href = route.href;
    this.fullPath = route.fullPath;
    this.path = route.path;
    this.params = { ...route.params };
    this.query = { ...route.query };
    this.hash = route.hash;
    this.matched = [];
    this.meta = { ...route.meta };
    // prop
    this.title = route.meta.title || '';
  }

  // route
  name = '';
  href = '';
  fullPath = '';
  path = '';
  params = {};
  query = {};
  hash = '';
  matched = [];
  meta = {};

  // prop
  tabPage = null;
  title = '';
  component = null; // private

  // event
  onMounted = null;
  onActivated = null;
  onDeactivated = null;
  onBeforeUnmount = null;
  mounted() { return this.onMounted?.(); }
  activated() { return this.onActivated?.(); }
  deactivated() { return this.onDeactivated?.(); }
  beforeUnmount() { return this.onBeforeUnmount?.(); }

  // method
  active(...args) { return this.tabPage?.active(this, ...args); }
  refresh(...args) { return this.tabPage?.refresh(this, ...args); }
  close(...args) { return this.tabPage?.close(this, ...args); }
}

class TabPage {
  blank = null;
  router = null;
  items = [];
  incrid = 0;

  constructor({ router, blank = null }) {
    this.router = router;
    this.blank = blank;
    this.items = reactive([]);
    this.router.afterEach((to, from, failure) => this.add(to, from, failure));
  }

  enable() {
    this.items.splice(0, this.items.length - 1);
  }

  disable() {
    this.items.splice(0);
  }

  add(to, from, failure) {
    if (failure) { return; }
    let i = this.items.findIndex(v => v.fullPath == to.fullPath), tab = this.items[i];
    if (i == -1) {
      tab = new Tab(to);
      tab.tabPage = this;
      tab.component = markRaw(defineComponent({ name: 'TabPageComponent' + ++this.incrid, setup: (_, { attrs, slots }) => () => h(attrs.component, _, slots) }));
      if (history.state.replaced)  {
        let n = this.items.findIndex(v => v.fullPath == from.fullPath);
        if (n == -1) {
          this.items.push(tab);
        } else {
          this.items.splice(n, 1, tab);
        }
      } else {
        this.items.push(tab);
      }
    }
    to.component = tab.component;
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

  close(tab, action = false) {
    const i = this.items.findIndex(v => v.fullPath == tab.fullPath);
    if (i == -1) { return; }
    this.items.splice(i, 1);
    if (action == 'back') {
      this.router.back();
    } else if (action == 'forward') {
      this.router.forward();
    } else if (action == 'left') {
      const left = this.items[i-1] ?? this.items[i] ?? this.blank;
      if (left) { this.router.push(left); }
    } else if (action == 'right') {
      const right = this.items[i] ?? this.items[i-1] ?? this.blank;
      if (right) { this.router.push(right); }
    }
  }
}

const useTabPage = () => {
  return inject(tabPageKey);
};

const useTab = () => {
  const tabPage = useTabPage();
  return tabPage.items.find(v => v.fullPath == tabPage.router.currentRoute.value?.fullPath);
};

const onTabMounted = (callback, tab = useTab()) => {
  if (!tab) { return; }
  tab.onMounted = callback;
  onMounted(() => tab.mounted());
};

const onTabActivated = (callback, tab = useTab()) => {
  if (!tab) { return; }
  tab.onActivated = callback;
  onActivated(() => tab.activated());
};

const onTabDeactivated = (callback, tab = useTab()) => {
  if (!tab) { return; }
  tab.onDeactivated = callback;
  onDeactivated(() => tab.deactivated());
};

const onTabBeforeUnmount = (callback, tab = useTab()) => {
  if (!tab) { return; }
  tab.onBeforeUnmount = callback;
  onBeforeUnmount(() => tab.beforeUnmount());
};

export {
  tabPageKey,
  Tab,
  TabPage,
  useTabPage,
  useTab,
  onTabMounted,
  onTabActivated,
  onTabDeactivated,
  onTabBeforeUnmount,
};
