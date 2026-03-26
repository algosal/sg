#!/usr/bin/env node

/**
 * File: run.js
 * Purpose: Launches the SG app using Vite with custom config.
 */

import { spawn } from "child_process";
import path from "path";
import os from "os";
import fs from "fs";

// 🔷 SG Banner
console.log(`
 ███████╗  ██████╗
██╔════╝ ██╔════╝
███████╗ ██║  ███╗
╚════██║ ██║   ██║
███████║ ╚██████╔╝
╚══════╝  ╚═════╝

🚀 SG CLI - Powered by Conscious Neurons LLC
https://consciousneurons.com
Built by Salman Saeed
🔹 Starting your SG App...
`);

// ✅ Correct config path (NO template folder)
const configPath = path.resolve("./sg.config.js");

// ✅ Check if config exists
const hasConfig = fs.existsSync(configPath);

// ✅ Cross-platform npx
const command = os.platform() === "win32" ? "npx.cmd" : "npx";

// ✅ Vite args
const viteArgs = ["vite"];

if (hasConfig) {
  viteArgs.push("--config", configPath);
}

// 🔁 Spawn Vite
const vite = spawn(command, viteArgs, {
  stdio: "pipe",
  shell: os.platform() === "win32",
});

// 📤 Filter Vite banner
vite.stdout.on("data", (data) => {
  const str = data.toString();
  if (!str.includes("VITE")) {
    console.log(str);
  }
});

// 📛 Errors
vite.stderr.on("data", (data) => {
  process.stderr.write(data);
});

// 🔚 Exit handling
vite.on("close", (code) => {
  console.log(`\n✅ SG App stopped (exit code ${code ?? 0})`);
  process.exit(code ?? 0);
});
