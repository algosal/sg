/**
 * File: sg.config.js
 * Purpose: Vite configuration for SG-generated apps.
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: ".", // project root
  plugins: [react()],
  server: {
    port: 4321,
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: path.resolve(__dirname, "public/index.html"),
    },
  },
  clearScreen: false,
});
