import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: false,
  build: {
    emptyOutDir: true,
    cssMinify: false,
    lib: {
      entry: 'src/bundle.ts',
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'styles',
    },
    rolldownOptions: {
      external: /^react(-dom)?(\/|$)/,
    },
  },
});
