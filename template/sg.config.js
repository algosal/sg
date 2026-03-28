/**
 * File: sg.config.js
 * Purpose: Vite configuration for SG-generated apps.
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: ".",
  base: "/",
  plugins: [react()],
  server: {
    port: 4321,
  },
  build: {
    outDir: "dist",
  },
  clearScreen: false,
});
