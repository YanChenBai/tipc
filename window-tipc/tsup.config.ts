import process from 'node:process'
import { defineConfig } from 'tsup'

const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
  tsconfig: '../tsconfig.node.json',
  entry: {
    index: 'index.ts',
    renderer: 'renderer.ts',
    type: 'type.ts',
    env: 'env.d.ts',
  },
  external: [
    'electron',
    '@byc/tipc',
    'hmc-win32',
  ],
  format: ['cjs', 'esm'],
  sourcemap: isDev,
  minify: false,
  splitting: true,
  clean: true,
  dts: true,
  esbuildOptions(options) {
    options.conditions = ['dev']
  },
})
