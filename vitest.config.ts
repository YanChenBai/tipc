import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['core/__test__/**'],
    environment: 'node',
    coverage: {
      include: [
        'core/**/*.ts',
      ],
      exclude: [
        'core/type.ts',
        'core/__test__/**',
      ],
    },
  },
})
