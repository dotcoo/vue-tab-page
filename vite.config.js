import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'lib/index.js',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', 'vue-router'],
    },
  },
});
