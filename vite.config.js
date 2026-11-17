
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],

  server: {
    port: 5173,

    allowedHosts: [
      "cusp-bargraph-overhung.ngrok-free.dev"
    ],

    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true
      },

      "/uploads": {
        target: "http://localhost:4000",
        changeOrigin: true
      }
    }
  }
});
