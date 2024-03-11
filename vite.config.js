import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        IconsResolver({
          prefix: false,
          enabledCollections: ['mdi'],
        })
      ],
    }),
    Icons({
      compiler: 'vue3'
    }),
  ],
  rollupOptions: {
    output: {
      manualChunks: {
        'group-home': [
          './src/pages/WelcomePage',
          './src/pages/HomePage',
        ],
        'group-identification': [
          './src/pages/CameraPage',
          './src/pages/ResultPage',
        ],
        'group-list': [
          './src/pages/ListPage',
          './src/pages/DetailPage',
        ],
      },
    },
  },
})
