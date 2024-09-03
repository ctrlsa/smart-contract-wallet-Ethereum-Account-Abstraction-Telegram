import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react-swc";
// import basicSsl from '@vitejs/plugin-basic-ssl';
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react(), tsconfigPaths()],
  define: {
    global: "globalThis",
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
});
