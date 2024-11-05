import process from 'node:process'
import { defineConfig } from 'tsup'

const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
  tsconfig: './tsconfig.node.json',
  entry: ['src/index.ts', 'src/type.ts'],
  external: ['electron'],
  format: ['cjs', 'esm'],
  sourcemap: isDev,
  minify: false,
  splitting: true,
  clean: true,
  dts: true,
  skipNodeModulesBundle: true,
  esbuildOptions(options) {
    options.conditions = ['dev']
  },
})
