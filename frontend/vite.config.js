import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "");
  const proxyTarget =
    env.VITE_DEV_PROXY_TARGET?.trim() || "http://127.0.0.1:8000";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        // `yarn start` / `vite`: browser calls http://localhost:5173/api/... → Django :8000
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
        },
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
  };
});
