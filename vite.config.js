import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// The PHP API lives in ./backend and is served by Apache/XAMPP. In development we
// proxy /api requests to it so the browser never has to deal with CORS and the
// project path (which contains a space) stays out of the front-end code.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget =
    env.VITE_API_TARGET ||
    "http://localhost/Portfolio%20projects/happyChop/backend";

  return {
    plugins: [react()],
    server: {
      port: 5173,
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
