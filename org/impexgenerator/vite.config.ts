/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { defineConfig } from 'vite';

const projectRoot = dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    root: projectRoot,
    cacheDir: `../node_modules/.vite`,
    build: {
      outDir: '../dist/impexgenerator/client',
      reportCompressedSize: true,
      target: ['es2020'],
    },
    resolve: {
      tsconfigPaths: true,
    },
    server: {
      fs: {
        allow: ['.'],
      },
    },
    plugins: [analog()],
    test: {
      globals: true,
      pool: 'threads',
      environment: 'jsdom',
      setupFiles: [resolve(projectRoot, 'src/test-setup.ts')],
      include: ['**/*.spec.ts'],
      reporters: ['default'],
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
  };
});
