import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
//import basicSsl from '@vitejs/plugin-basic-ssl'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  server: { https: true },
  build: {
    sourcemap: true,
    assetsDir: "code",
    target: ["esnext", "edge100", "firefox100", "chrome100", "safari18"],
  },
  plugins: [
    VitePWA({
      strategies: "injectManifest",
      injectManifest: {
        swSrc: 'public/sw.js',
        swDest: 'dist/sw.js',
        globDirectory: 'dist',
        globPatterns: [
          '**/*.{html,js,css,json, png}',
        ],
      },
      injectRegister: false,
      manifest: false,
      devOptions: {
        enabled: true
      }
    }),
    mkcert()
  ]
})
