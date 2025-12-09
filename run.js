#!/usr/bin/env node
import { spawn } from "child_process";
import path from "path";

// 1️⃣ Custom AG Banner
console.log(`
 █████╗  ██████╗
██╔══██╗██╔═══██╗
███████║██║   
██╔══██║██║ █║██║
██║  ██║╚██████╔╝
╚═╝  ╚═╝ ╚═════╝

🚀 AG CLI - Powered by Conscious Neurons LLC
https://consciousneurons.com
buit by Salman Saeed
https://salmansaeed.us
🔹 Starting your AG App...
`);

const configPath = path.resolve("./template/ag.config.js");

// 2️⃣ Spawn Vite dev server but hide its banner
const vite = spawn("npx", ["vite", "--config", configPath], {
  stdio: "pipe",
});

vite.stdout.on("data", (data) => {
  const str = data.toString();
  // Filter out VITE banner
  if (!str.includes("VITE")) console.log(str);
});

vite.stderr.on("data", (data) => {
  process.stderr.write(data);
});

vite.on("close", (code) => {
  console.log(`\n✅ AG App stopped (exit code ${code})`);
  process.exit(code);
});
