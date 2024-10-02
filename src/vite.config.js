import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    nodePolyfills(
      { include: ['fs'],
        globals: {
          Buffer: true,
          global: true,
          process: true,
        } 
//        ,overrides: { fs: 'memfs' } 
})
  ],
});