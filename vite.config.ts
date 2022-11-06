import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslit from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), eslit()],
  server: {
    port: 3000,
  }
});
