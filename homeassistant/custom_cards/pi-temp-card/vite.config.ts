import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5020,
    open: true,
  },
  build: {
    lib: {
      entry: "src/pi-temp-card.ts",
      name: "PiTempCard",
      fileName: () => "pi-temp-card.js",
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
