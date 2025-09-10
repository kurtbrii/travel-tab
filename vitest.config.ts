import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    reporters: ['default'],
    coverage: {
      enabled: false,
      provider: 'v8',
      reportsDirectory: './coverage',
    },
    setupFiles: ['./vitest.setup.ts'],
    environmentMatchGlobs: [
      ['src/**/__tests__/**', 'jsdom'],
      ['src/**/?(*.)+(test).tsx', 'jsdom'],
      ['src/**/?(*.)+(test).ts', 'node'],
      ['src/server/**', 'node'],
    ],
  },
})

