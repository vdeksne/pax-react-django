import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split vendor chunks for better caching
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) {
              return "react-vendor";
            }
            if (id.includes("react-router")) {
              return "router-vendor";
            }
            if (id.includes("axios")) {
              return "axios-vendor";
            }
            if (id.includes("chart.js") || id.includes("react-chartjs")) {
              return "chart-vendor";
            }
            // Other large dependencies
            return "vendor";
          }
        },
      },
    },
    // Use esbuild for minification (default, faster than terser)
    minify: "esbuild",
    // Optimize chunk size warning limit
    chunkSizeWarningLimit: 1000,
    sourcemap: false, // Disable in production for faster builds
  },
});
