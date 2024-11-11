import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/__test__/**/*'],
    environment: 'node',
    coverage: {
      include: ['src/**/*.ts'],
    },
  },
})
