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
🔹 React Power.
🔹 Angular Simplicity.
🔹 Vite Speed

`);

const configPath = path.resolve("./sg.config.js");
const hasConfig = fs.existsSync(configPath);

const command = os.platform() === "win32" ? "npx.cmd" : "npx";
const viteArgs = ["vite"];

if (hasConfig) {
  viteArgs.push("--config", configPath);
}

const vite = spawn(command, viteArgs, {
  stdio: "pipe",
  shell: os.platform() === "win32",
});

vite.stdout.on("data", (data) => {
  const str = data.toString();
  if (!str.includes("VITE")) {
    console.log(str);
  }
});

vite.stderr.on("data", (data) => {
  process.stderr.write(data);
});

vite.on("close", (code) => {
  console.log(`\n✅ SG App stopped (exit code ${code ?? 0})`);
  process.exit(code ?? 0);
});
