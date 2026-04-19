import { copyFileSync } from 'node:fs'
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'adapters/storage': 'src/adapters/storage.ts',
    'adapters/transport': 'src/adapters/transport.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom'],
  sourcemap: true,
  onSuccess: async () => {
    copyFileSync('src/styles.css', 'dist/styles.css')
  },
})
