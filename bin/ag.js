#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const command = args[0]; // "new"
const shortcut = args[1]; // "gc", "cc", "svc", "ctx"
const name = args[2]; // custom project/component name

if (!command || !shortcut) {
  console.log("Usage: node ag.js new <gc|cc|svc|ctx> [Name]");
  process.exit(1);
}

// Shortcuts mapping
const SHORTCUTS = {
  gc: "MyGameProject",
  cc: "MyCommerceProject",
  svc: "MyService",
  ctx: "MyContext",
};

// Resolve final name
const finalName = name || SHORTCUTS[shortcut];

// Handle service/context creation
if (shortcut === "svc") {
  const servicePath = path.join(
    process.cwd(),
    "src/services",
    `${finalName}.js`
  );
  fs.mkdirSync(path.dirname(servicePath), { recursive: true });
  fs.writeFileSync(
    servicePath,
    `// Service: ${finalName}\n\nexport default function ${finalName}() {\n  return null;\n}\n`
  );
  console.log(`✅ Service created at src/services/${finalName}.js`);
  process.exit(0);
}

if (shortcut === "ctx") {
  const ctxPath = path.join(process.cwd(), "src/contexts", `${finalName}.js`);
  fs.mkdirSync(path.dirname(ctxPath), { recursive: true });
  fs.writeFileSync(
    ctxPath,
    `// Context: ${finalName}\n\nimport { createContext } from 'react';\nexport const ${finalName} = createContext(null);\n`
  );
  console.log(`✅ Context created at src/contexts/${finalName}.js`);
  process.exit(0);
}

// Otherwise, fallback to full project creation
const ROOT = process.cwd();
const PROJECT_DIR = path.join(ROOT, finalName);
const TEMPLATE_DIR = path.join(__dirname, "../template");

// 1️⃣ Create project folder
fs.mkdirSync(PROJECT_DIR, { recursive: true });

// 2️⃣ Copy template recursively (excluding node_modules)
function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      if (item === "node_modules") continue;
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}
copyRecursive(TEMPLATE_DIR, PROJECT_DIR);

// 3️⃣ Create package.json
const pkg = {
  name: finalName,
  version: "1.0.0",
  type: "module",
  scripts: { dev: "node run.js" },
  dependencies: { react: "^18.3.1", "react-dom": "^18.3.1" },
  devDependencies: { vite: "^7.2.7", "@vitejs/plugin-react": "^4.3.3" },
};
fs.writeFileSync(
  path.join(PROJECT_DIR, "package.json"),
  JSON.stringify(pkg, null, 2)
);

// 4️⃣ Generate run.js dynamically
const runJsContent = `#!/usr/bin/env node
import { spawn } from "child_process";
import path from "path";

console.log(\`
 █████╗  ██████╗
██╔══██╗██╔═══██╗
███████║██║   
██╔══██║██║ █║██║
██║  ██║╚██████╔╝
╚═╝  ╚═╝ ╚═════╝

🚀 AG CLI - Powered by Conscious Neurons LLC
https://consciousneurons.com
Built by Salman Saeed
🔹 Starting your AG App...
\`);

const configPath = path.resolve("./ag.config.js");
const vite = spawn("npx", ["vite", "--config", configPath], { stdio: "pipe" });

vite.stdout.on("data", (data) => {
  const str = data.toString();
  if (!str.includes("VITE")) console.log(str);
});

vite.stderr.on("data", (data) => process.stderr.write(data));

vite.on("close", (code) => {
  console.log(\`\\n✅ AG App stopped (exit code \${code})\`);
  process.exit(code);
});
`;

fs.writeFileSync(path.join(PROJECT_DIR, "run.js"), runJsContent);

console.log("✔ Project created!");
console.log(`cd ${finalName}`);
console.log("npm install");
console.log("npm run dev");
