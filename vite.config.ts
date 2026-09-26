import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

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
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://dreadcast-simulator-kappa.vercel.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;

          if (id.includes('@supabase')) return 'supabase';
          if (id.includes('@tanstack')) return 'tanstack';
          if (id.includes('@dnd-kit')) return 'dnd';
          if (id.includes('@base-ui')) return 'base-ui';
          if (id.includes('/zod/')) return 'zod';

          return 'vendor';
        },
      },
    },
  },
}));
