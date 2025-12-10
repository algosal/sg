#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const command = args[0]; // "new"
const shortcut = args[1]; // "gc", "cc", "svc", "ctx", or "app"
const name = args[2]; // custom project/component name

if (!command || !shortcut) {
  console.log("Usage: sg new <app|gc|cc|svc|ctx> [Name]");
  process.exit(1);
}

// Helper: convert string to PascalCase
function toPascalCase(str) {
  return str
    .split(/[\s-_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

// Shortcuts mapping
const SHORTCUTS = {
  gc: "MyGameComponent",
  cc: "MyCommerceComponent",
  svc: "MyService",
  ctx: "MyContext",
};

// Resolve final name
let finalName;
if (
  shortcut === "gc" ||
  shortcut === "cc" ||
  shortcut === "svc" ||
  shortcut === "ctx"
) {
  if (!name && !SHORTCUTS[shortcut]) {
    console.log("Please provide a name for the component/service/context.");
    process.exit(1);
  }
  finalName = toPascalCase(name || SHORTCUTS[shortcut]);
} else if (shortcut === "app") {
  if (!name) {
    console.log("Please provide a name for the app: sg new app MyApp");
    process.exit(1);
  }
  finalName = toPascalCase(name);
} else {
  console.log("Unknown shortcut. Use gc, cc, svc, ctx, or app.");
  process.exit(1);
}

// =====================
// Handle Service creation
// =====================
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

// =====================
// Handle Context creation
// =====================
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

// =====================
// Handle Component creation (gc, cc)
// =====================
if (shortcut === "gc" || shortcut === "cc") {
  const COMPONENT_DIR = path.join(process.cwd(), "src/components", finalName);
  fs.mkdirSync(COMPONENT_DIR, { recursive: true });

  const jsxContent = `import React from "react";
import "./${finalName}.css";
import ${finalName}JS from "./${finalName}JS";

const ${finalName} = () => {
  return (
    <div className="${finalName.toLowerCase()}-container">
      <h2>${finalName} Component</h2>
      <${finalName}JS />
    </div>
  );
};

export default ${finalName};
`;

  fs.writeFileSync(path.join(COMPONENT_DIR, `${finalName}.jsx`), jsxContent);

  const jsxChildContent = `import React from "react";

const ${finalName}JS = () => {
  return (
    <div className="${finalName.toLowerCase()}-js">
      <p>This is the ${finalName}JS child component!</p>
    </div>
  );
};

export default ${finalName}JS;
`;

  fs.writeFileSync(
    path.join(COMPONENT_DIR, `${finalName}JS.jsx`),
    jsxChildContent
  );

  const cssContent = `.${finalName.toLowerCase()}-container {
  border: 2px solid #ffd700;
  padding: 20px;
  margin: 10px;
  background-color: #1f2a48;
  color: #f8f9fc;
  border-radius: 8px;
}

.${finalName.toLowerCase()}-js {
  margin-top: 10px;
  padding: 10px;
  background-color: #2a3a6a;
  color: #ffd700;
  border-radius: 6px;
}
`;

  fs.writeFileSync(path.join(COMPONENT_DIR, `${finalName}.css`), cssContent);

  console.log(
    `✅ Component '${finalName}' created at src/components/${finalName}`
  );
  process.exit(0);
}

// =====================
// Handle App creation
// =====================
if (shortcut === "app") {
  const ROOT = process.cwd();
  const PROJECT_DIR = path.join(ROOT, finalName);
  const TEMPLATE_DIR = path.join(__dirname, "../template");

  fs.mkdirSync(PROJECT_DIR, { recursive: true });

  // ✅ Ensure public folder exists with favicon, logo, manifest
  const PUBLIC_DIR = path.join(PROJECT_DIR, "public");
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  ["favicon.png", "logo.png"].forEach((file) => {
    // const srcPath = path.join(TEMPLATE_DIR, file);
    const srcPath = path.join(TEMPLATE_DIR, "public", file);

    const destPath = path.join(PUBLIC_DIR, file);
    if (fs.existsSync(srcPath)) fs.copyFileSync(srcPath, destPath);
    else console.warn(`⚠️ ${file} not found in template folder`);
  });

  // manifest.json
  const manifestContent = `{
  "name": "${finalName}",
  "short_name": "${finalName}",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#0a0f24",
  "theme_color": "#ffd700"
}`;
  fs.writeFileSync(path.join(PUBLIC_DIR, "manifest.json"), manifestContent);

  // Copy index.html one folder up from public
  const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="manifest" href="/manifest.json" />
    <title>${finalName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./src/main.jsx"></script>
  </body>
</html>`;
  fs.writeFileSync(path.join(PROJECT_DIR, "index.html"), indexHtmlContent);

  // Copy template recursively
  function copyRecursive(src, dest) {
    if (!fs.existsSync(src)) return;
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

  // Ensure src folder exists
  const srcDir = path.join(PROJECT_DIR, "src");
  fs.mkdirSync(srcDir, { recursive: true });

  // main.jsx
  const mainJsxPath = path.join(srcDir, "main.jsx");
  if (!fs.existsSync(mainJsxPath)) {
    const mainJsxContent = `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;
    fs.writeFileSync(mainJsxPath, mainJsxContent);
  }

  // App.jsx
  const appJsxPath = path.join(srcDir, "App.jsx");
  if (!fs.existsSync(appJsxPath)) {
    const appJsxContent = `import React from "react";
import "./App.css";
import Logo from "./logo.png";
import Navbar from "./components/Navbar/Navbar";


const App = () => {
  return (
    <div className="app-container">
    <Navbar />
      <img src={Logo} alt="App Logo" className="app-logo" />
      <h1>Welcome to ${finalName}</h1>
      <p>Your SG App is ready!</p>
   
   <p>
  Powered by{" "}
  <a
    href="https://consciousneurons.com"
    target="_blank"
    rel="noopener noreferrer"
    onClick={(e) => e.stopPropagation()}
  >
    Conscious Neurons LLC
  </a>
  {" "} | Sponsored by{" "}
  <a
    href="https://albagoldsystems.com"
    target="_blank"
    rel="noopener noreferrer"
    onClick={(e) => e.stopPropagation()}
  >
    Alba Gold
  </a>
</p>

    </div>
  );
};

export default App;`;
    fs.writeFileSync(appJsxPath, appJsxContent);
  }

  // App.css
  const cssPath = path.join(srcDir, "App.css");
  if (!fs.existsSync(cssPath)) {
    const defaultCss = `body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background-color: #0a0f24;
  color: #f8f9fc;
}

a { color: #ffd700; text-decoration: none; }

.app-logo {
  width: 120px;
  height: auto;
  margin: 20px auto;
  display: block;
  animation: rotateY 5s linear infinite;
}

.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
}

@keyframes rotateY {
  0% { transform: rotateY(0deg); }
  50% { transform: rotateY(180deg); }
  100% { transform: rotateY(360deg); }
}`;
    fs.writeFileSync(cssPath, defaultCss);
  }

  // package.json
  const pkg = {
    name: finalName,
    version: "1.0.0",
    type: "module",
    scripts: {
      dev: "node run.js",
      start: "node run.js",
      sg: "node run.js",
      build: "vite build",
      preview: "vite preview",
    },
    dependencies: {
      react: "^18.3.1",
      "react-dom": "^18.3.1",
      "react-router-dom": "^6.15.0",
    },
    devDependencies: { vite: "^7.2.7", "@vitejs/plugin-react": "^4.3.3" },
  };
  fs.writeFileSync(
    path.join(PROJECT_DIR, "package.json"),
    JSON.stringify(pkg, null, 2)
  );

  // Automatically install dependencies
  console.log("\n📦 Installing dependencies...");
  try {
    execSync("npm install", { stdio: "inherit", cwd: PROJECT_DIR });
    console.log("✅ Dependencies installed successfully!");
  } catch (err) {
    console.error(
      "❌ Failed to install dependencies. Run 'npm install' manually."
    );
  }

  // run.js
  //   const runJsContent = `#!/usr/bin/env node
  // import { spawn } from "child_process";
  // import path from "path";

  // console.log(\`
  //   ███████╗ ██████╗
  // ██╔════╝ ██╔═══██╗
  // ███████╗ ██║
  // ╚════██║ ██║ █ ██║
  // ███████║ ╚██████╔╝
  // ╚══════╝  ╚═════╝

  // 🚀 AG CLI - Powered by Conscious Neurons LLC
  // https://consciousneurons.com
  // Built by Salman Saeed
  // 🔹 Starting your AG App...
  // \`);

  // const configPath = path.resolve("./ag.config.js");
  // const vite = spawn("npx", ["vite", "--config", configPath, "--port", "4321"], { stdio: "pipe" });

  // vite.stdout.on("data", (data) => {
  //   const str = data.toString();
  //   if (!str.includes("VITE")) console.log(str);
  // });

  // vite.stderr.on("data", (data) => process.stderr.write(data));

  // vite.on("close", (code) => {
  //   console.log(\`\\n✅ AG App stopped (exit code \${code})\`);
  //   process.exit(code);
  // });
  // `;
  const runJsContent = `#!/usr/bin/env node
import { spawn } from "child_process";
import path from "path";
import os from "os";

console.log(\`
  ███████╗ ██████╗
██╔════╝ ██╔═══██╗
███████╗ ██║   
╚════██║ ██║ █ ██║
███████║ ╚██████╔╝
╚══════╝  ╚═════╝


🚀 AG CLI - Powered by Conscious Neurons LLC
https://consciousneurons.com
Built by Salman Saeed
🔹 Starting your AG App...
\`);

let configPath = path.resolve("./ag.config.js");

// Convert Windows backslashes to forward slashes
if (os.platform() === "win32") {
  configPath = configPath.replace(/\\\\/g, "/");
}

// Use npx.cmd on Windows
const command = os.platform() === "win32" ? "npx.cmd" : "npx";

// Set shell: true on Windows to fix spawn EINVAL
const vite = spawn(
  command,
  ["vite", "--config", configPath, "--port", "4321"],
  {
    stdio: "pipe",
    shell: os.platform() === "win32",
  }
);

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

  console.log("\n🎉 Project created successfully!");
  console.log(`cd ${finalName}`);
  console.log("npm run sg   # or npm start / npm run dev to launch the app");
  console.log("npm run build  # to build the project");
  console.log("npm run preview  # to preview the build");
}
