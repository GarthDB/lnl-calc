import { defineConfig } from 'vite';

export default defineConfig({
  base: '/lnl-calc/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: true,
  },
  esbuild: {
    // Allow TypeScript errors during development
    logLevel: 'silent'
  }
}); 