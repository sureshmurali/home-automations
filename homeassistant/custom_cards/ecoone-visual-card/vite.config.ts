import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/ecoone-visual-card.ts",
      name: "EcoOneVisualCard",
      fileName: () => "ecoone-visual-card.js",
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
