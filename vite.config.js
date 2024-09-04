import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
   
  ],
  server: {
    watch: {
      // Use polling to ensure changes are immediately detected
      usePolling: true,
    }
  },
  // Forcing browser to always load updated files
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`
      }
    }
  }
  // otras configuraciones
});



