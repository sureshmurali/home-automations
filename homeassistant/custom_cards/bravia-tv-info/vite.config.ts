import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/bravia-tv-info.ts",
      formats: ["es"],
      fileName: () => "bravia-tv-info.js",
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
