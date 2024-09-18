import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths({
      projects: ["tsconfig.app.json"],
    }),
    dts({
      outDir: "types",
      tsconfigPath: resolve(__dirname, "tsconfig.app.json"),
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/index.ts"),
      name: "MyLib",
      // the proper extensions will be added
      fileName: "index",
    },
    rollupOptions: {
      external: ["zustand"],
      output: {
        globals: {
          zustand: "zustand",
        },
      },
    },
  },
});
