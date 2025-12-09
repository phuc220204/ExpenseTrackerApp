import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
