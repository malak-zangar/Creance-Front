import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [react(), nodePolyfills({
    globals: {
      Buffer: true,
    },
    include: ['path', 'stream'], // Add other modules as needed
  }),],
  resolve: {
    alias: {
      'react': 'react',
      'react-dom': 'react-dom',
      'fs': 'rollup-plugin-node-polyfills/polyfills/fs',
      buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
      path: 'path-browserify',
      fs: 'browserify-fs',
      stream: 'stream-browserify', // Add stream polyfill // Use a polyfill for fs if needed
    },

  },
  optimizeDeps: {
    include: ['pdfkit'],
    esbuildOptions: {
      plugins: [
        // Ensure any additional plugins you need are configured
      ],
    },
  },
  
  build: {
    rollupOptions: {
      external: ['fontkit'], // Exclude fontkit from the bundle
    },
  },
})
