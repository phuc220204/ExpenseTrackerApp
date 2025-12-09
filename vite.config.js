import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["logoApp.svg"],
      manifest: {
        name: "Sổ Thu Chi AI",
        short_name: "Thu Chi",
        description: "Ứng dụng quản lý thu chi cá nhân thông minh",
        theme_color: "#3B82F6",
        background_color: "#0F172A",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          {
            src: "/logoApp.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        // Cache tất cả assets
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        // Runtime caching cho API calls
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "firestore-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60, // 1 hour
              },
            },
          },
        ],
      },
    }),
  ],
  server: {
    // Cấu hình header để cho phép Popup hoạt động
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      "Cross-Origin-Embedder-Policy": "unsafe-none",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "firebase-vendor": [
            "firebase/app",
            "firebase/auth",
            "firebase/firestore",
          ],
          "ui-vendor": ["@heroui/react", "framer-motion", "lucide-react"],
          "chart-vendor": ["recharts"],
          "utils-vendor": ["date-fns", "xlsx", "file-saver"],
          "ai-vendor": ["@google/generative-ai", "@google/genai"],
        },
      },
    },
    // Tăng warning limit lên nếu cần thiết
    chunkSizeWarningLimit: 1000,
  },
});
