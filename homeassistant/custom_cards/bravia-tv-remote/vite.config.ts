import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/bravia-tv-remote.ts",
      formats: ["es"],
      fileName: () => "bravia-tv-remote.js",
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
