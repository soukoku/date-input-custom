import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  // build: {
  //   lib: {
  //     entry: resolve(__dirname, 'src/components/lib.ts'),
  //     name:'mylib'
  //   },
  //   rollupOptions: {
  //     external: ['vue'],
  //     output: {
  //       globals: {
  //         vue: 'Vue'
  //       }
  //     }
  //   }
  // },
  plugins: [vue()]
})
