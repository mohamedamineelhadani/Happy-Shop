import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Standalone admin app. It talks to the same PHP API as the storefront; in
// development /api is proxied to the backend so there is never a CORS problem.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget =
    env.VITE_API_TARGET ||
    "http://localhost/Portfolio%20projects/happyChop/backend";
  // Uploaded product images live in the backend's public folder.
  const mediaTarget =
    env.VITE_MEDIA_TARGET || `${apiTarget.replace(/\/+$/, "")}/public`;

  return {
    plugins: [react()],
    server: {
      port: 5174,
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
        },
        "/images": {
          target: mediaTarget,
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: "dist",
      sourcemap: false,
    },
  };
});
