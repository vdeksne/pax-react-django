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
          // Simplified chunking to avoid React loading issues
          // Keep all React-related code together
          if (id.includes("node_modules")) {
            // Bundle React ecosystem together to avoid dependency issues
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router")
            ) {
              return "react-vendor";
            }
            // Separate large chart library
            if (id.includes("chart.js") || id.includes("react-chartjs")) {
              return "chart-vendor";
            }
            // Keep everything else in one vendor chunk to avoid loading order issues
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
