import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5010,
    open: true,
  },
  build: {
    lib: {
      entry: "src/bravia-tv-display.ts",
      formats: ["es"],
      fileName: () => "bravia-tv-display.js",
    },
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
    outDir: "dist",
    emptyOutDir: true,
    target: "es2020",
    minify: true,
    sourcemap: true,
  },
});
