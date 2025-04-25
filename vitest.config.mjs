import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'
import viteTsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    include: ['src/core/usecases/**/*.spec.ts'],
    exclude: ['tests/e2e/**/*.spec.ts'],
    globals: true,
    environment: 'node',
  },
  plugins: [
    viteTsConfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
})
