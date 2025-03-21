import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig, externalizeDepsPlugin, swcPlugin } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin(),
      swcPlugin(),
    ],
    resolve: {
      conditions: ['dev'],
    },
  },
  preload: {
    plugins: [
      externalizeDepsPlugin(),
    ],
    resolve: {
      conditions: ['dev'],
    },
  },
  renderer: {
    resolve: {
      conditions: ['dev'],
      alias: {
        '@renderer': resolve('src/renderer/src'),
      },
    },
    plugins: [vue()],
  },
})
