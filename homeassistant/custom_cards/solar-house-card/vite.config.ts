import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/solar-house-card.ts",
      name: "SolarHouseCard",
      fileName: () => "solar-house-card.js",
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
