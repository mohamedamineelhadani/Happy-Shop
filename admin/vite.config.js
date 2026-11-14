import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Standalone admin app. It talks to the same PHP API as the storefront; in
// development /api is proxied to the backend so there is never a CORS problem.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget =
    env.VITE_API_TARGET ||
    "http://localhost/Portfolio%20projects/happyChop/backend";

  return {
    plugins: [react()],
    // Product images are uploaded into the storefront's public folder. Serving
    // that folder here means /images/products/... resolves in the dashboard too.
    publicDir: path.resolve(process.cwd(), "../public"),
    server: {
      port: 5174,
      proxy: {
        "/api": {
          target: apiTarget,
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
