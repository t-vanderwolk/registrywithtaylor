import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

/**
 * Test harness config.
 *
 * This supplies exactly one thing: the `@/*` path alias that `tsconfig.json`
 * already defines, so tests resolve repo imports the way Next.js does.
 *
 * Step 1's pure domain layer used relative imports and needed no config at all.
 * Step 2's service layer follows the repo convention of `@/lib/...`, which
 * Vitest cannot resolve on its own.
 *
 * Test discovery is deliberately left at Vitest's default, so this file cannot
 * silently narrow which suites run.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
});
