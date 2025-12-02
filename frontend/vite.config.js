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
    // Let Vite handle chunking automatically - it knows how to handle React properly
    // Removing manual chunking to fix React loading issues
    // Use esbuild for minification (default, faster than terser)
    minify: "esbuild",
    // Optimize chunk size warning limit
    chunkSizeWarningLimit: 1000,
    sourcemap: false, // Disable in production for faster builds
  },
});
