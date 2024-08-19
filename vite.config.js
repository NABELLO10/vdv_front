import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        // Configuración del manifiesto
        name: "TuPrimerERP",
        short_name: "TuPrimerERP",
   /*      name: "vdvChile",
        short_name: "vdvChile", */
        theme_color: "#ffffff",
        icons: [
          {
            src: "/logoDemo.jpg",
            //src: "/logo1.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/logoDemo.jpg",
            //src: "/logo1.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        start_url: "/",
        display: "standalone",
      },
      // No se usa swSrc aquí, porque estamos generando un SW nuevo
     /*  workbox: {
        // Opciones de Workbox
        // Por ejemplo, si quieres especificar el nombre del archivo del SW generado:
        swDest: 'registerSW.js',
      }, */
    }),
  ],
  // otras configuraciones
});
