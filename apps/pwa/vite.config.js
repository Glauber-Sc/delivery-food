// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import { VitePWA } from 'vite-plugin-pwa'

// export default defineConfig({
//   plugins: [
//     react(),
//     VitePWA({
//       registerType: 'autoUpdate',
//       workbox: {
//         globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg}'],
//         runtimeCaching: [
//           {
//             urlPattern: /^https:\/\/images\.pexels\.com\/.*/i,
//             handler: 'CacheFirst',
//             options: {
//               cacheName: 'pexels-images',
//               expiration: {
//                 maxEntries: 60,
//                 maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
//               }
//             }
//           },
//           {
//             urlPattern: /^http:\/\/localhost:3000\/api\/.*/i,
//             handler: 'NetworkFirst',
//             options: {
//               cacheName: 'api-cache',
//               expiration: {
//                 maxEntries: 50,
//                 maxAgeSeconds: 5 * 60 // 5 minutes
//               }
//             }
//           }
//         ]
//       },
//       manifest: {
//         name: 'Sabor Express - Delivery',
//         short_name: 'Sabor Express',
//         description: 'Peça suas comidas favoritas com facilidade',
//         theme_color: '#DF2C2D',
//         background_color: '#ffffff',
//         display: 'standalone',
//         start_url: '/',
//         icons: [
//           {
//             src: '/pwa-192x192.png',
//             sizes: '192x192',
//             type: 'image/png'
//           },
//           {
//             src: '/pwa-512x512.png',
//             sizes: '512x512',
//             type: 'image/png'
//           }
//         ]
//       }
//     })
//   ],
//   server: {
//     port: 5175
//   }
// })

// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg}"],
        runtimeCaching: [
          // Imagens de exemplo (ajuste se não usa)
          {
            urlPattern: /^https:\/\/images\.pexels\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "pexels-images",
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 dias
              },
            },
          },
          // Suas APIs backend (ajuste a URL em prod)
          {
            urlPattern: /^http:\/\/localhost:3000\/api\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60, // 5 min
              },
            },
          },
        ],
      },
      manifest: {
        name: "Sabor Express - Delivery",
        short_name: "Sabor Express",
        description: "Peça suas comidas favoritas com facilidade",
        theme_color: "#DF2C2D",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png" },
        ],
      },
    }),
  ],
  server: {
    port: 5175,
    proxy: {
      // Nominatim — exige identificação, não chame diretamente do browser
      "/api/nominatim": {
        target: "https://nominatim.openstreetmap.org",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/nominatim/, ""),
        headers: {
          // Identifique seu app + contato (e-mail de suporte)
          "User-Agent":
            "sabor-express/1.0 (contato: suporte@saborexpress.com.br)",
          Referer: "http://localhost:5175/",
        },
      },
      // OSRM (rotas)
      "/api/osrm": {
        target: "https://router.project-osrm.org",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/osrm/, ""),
      },
      // BigDataCloud (reverse geocode/IP)
      "/api/bdc": {
        target: "https://api.bigdatacloud.net",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/bdc/, ""),
      },
    },
  },
});
