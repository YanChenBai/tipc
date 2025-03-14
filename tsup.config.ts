import process from 'node:process'
import { defineConfig } from 'tsup'

const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
  tsconfig: './tsconfig.node.json',
  entry: {
    index: 'src/index.ts',
    main: 'src/main.ts',
    preload: 'src/preload.ts',
    // renderer: 'src/renderer.ts',
  },
  external: ['electron'],
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
