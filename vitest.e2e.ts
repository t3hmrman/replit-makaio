import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    passWithNoTests: true,
    include: [
      'test/components/**/*.e2e.ts',
    ],
    hookTimeout: 60_000,
    testTimeout: 60_000,
    teardownTimeout: 60_000,
  },
});
