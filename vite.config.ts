import { defineConfig } from 'vite';

export default defineConfig({
  base: '/lnl-calc/',
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true,
  },
  esbuild: {
    // Skip TypeScript checking to avoid dependency compilation issues
    include: /\.(ts|js|jsx)$/,
    exclude: ['node_modules/**/*.ts']
  }
}); 