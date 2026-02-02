import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'
import viteTsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    include: ['tests/e2e/*.spec.ts'],
    globals: true,
    hookTimeout: 30000,
    root: './',
    setupFiles: ['./tests/setup-e2e.ts'],
  },
  plugins: [
    viteTsConfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
})
