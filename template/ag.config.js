import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "template", // makes Vite treat 'template/' as root
  plugins: [react()],
  server: {
    port: 4321, // AG default port
  },
  build: {
    outDir: "../dist", // output relative to root
  },
  clearScreen: false, // prevents Vite banner clutter
});
