import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: ".", // <- serve from project root
  plugins: [react()],
  server: {
    port: 4321, // AG default port
  },
  build: {
    outDir: "dist", // relative to project root
  },
  clearScreen: false, // prevents Vite banner clutter
});
