import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  base: "./",
  server: {
    port: 3000,
    open: true,
    proxy: {
      "/graphql": {
        target: "http://localhost:3001",
        secure: false,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },  // Maps @ to src directory
      { find: '@components', replacement: path.resolve(__dirname, 'src/components') },  // Maps @components to src/components directory
      { find: '@libs', replacement: path.resolve(__dirname, 'src/lib') }  // Maps @libs to src/lib directory
    ]
  },
});
