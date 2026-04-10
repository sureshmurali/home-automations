import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  server: {
    port: 5001,
    open: true,
    fs: {
      // Allow serving files from the parent custom_cards directory (for shared assets)
      allow: [resolve(__dirname, "..")],
    },
  },
  build: {
    lib: {
      entry: "src/solar-dashboard.ts",
      name: "SolarDashboard",
      fileName: () => "solar-dashboard.js",
      formats: ["es"],
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
    outDir: "dist",
    emptyOutDir: true,
    target: "es2020",
    minify: true,
    sourcemap: true,
  },
});
