import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/__test__/**'],
    environment: 'node',
    coverage: {
      include: ['src/**/*.ts'],
      exclude: ['src/type.ts', 'src/renderer.ts', 'src/__test__/**'],
    },
  },
})
