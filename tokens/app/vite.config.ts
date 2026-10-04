import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Theme Studio publishes to Cloudflare Pages on the custom domain
// https://themes.3dbypixel.com (root path). VITE_BASE can override
// for previewing on a sub-path during local testing or fallback
// hosting like raw.githubusercontent.com.
const base = process.env.VITE_BASE ?? "/";

export default defineConfig({
  plugins: [react()],
  base,
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
  },
  server: {
    port: 5173,
    open: false,
  },
});
