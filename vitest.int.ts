import { defineConfig } from 'vitest/config';

import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [
    svelte({ hot: !process.env.VITEST }),
  ],

  test: {
    passWithNoTests: true,
    environment: 'jsdom',
    globals: true,
    include: [
      "test/components/**/*.int.ts",
    ],
    hookTimeout: 60_000,
    testTimeout: 60_000,
    teardownTimeout: 60_000,
  },
});
