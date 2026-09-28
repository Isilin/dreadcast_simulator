/// <reference types="vitest/config" />
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { configDefaults } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react({ tsDecorators: true }),
    ...(mode === 'analyze'
      ? [
          visualizer({
            filename: 'dist/stats.html',
            open: false,
            gzipSize: true,
            brotliSize: true,
          }),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      // API contract shared with the backend (typed client).
      '@server': path.resolve(import.meta.dirname, './server'),
    },
  },
  server: {
    proxy: {
      '/api': {
        // API_PROXY_TARGET=http://localhost:3001 to use `yarn dev:api`.
        target:
          process.env.API_PROXY_TARGET ??
          'https://dreadcast-simulator-kappa.vercel.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  test: {
    // .claude/worktrees holds other checkouts of the project.
    exclude: [...configDefaults.exclude, '.claude/**'],
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name(id) {
                if (!id.includes('node_modules')) return null;

                if (id.includes('@supabase')) return 'supabase';
                if (id.includes('@tanstack')) return 'tanstack';
                if (id.includes('@dnd-kit')) return 'dnd';
                if (id.includes('@base-ui')) return 'base-ui';
                if (id.includes('/effect/')) return 'effect';

                return 'vendor';
              },
            },
          ],
        },
      },
    },
  },
}));
