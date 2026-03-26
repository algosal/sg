#!/usr/bin/env node

/**
 * File: bin/sg.js
 * Purpose: Main entrypoint for the SG CLI. This file parses commands and
 * scaffolds apps, components, services, and contexts for React/Vite projects.
 */

import fs from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);

/**
 * Converts a string like "my-app" or "my_app" to PascalCase.
 */
function toPascalCase(str = "") {
  return str
    .trim()
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

/**
 * Converts a string like "My App" or "My_App" to kebab-case.
 */
function toKebabCase(str = "") {
  return str
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .split(/[\s_]+/)
    .join("-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

/**
 * Creates a valid CSS-friendly class prefix.
 */
function toCssClassName(str = "") {
  return toKebabCase(str).replace(/[^a-z0-9-]/g, "");
}

/**
 * Writes a file and ensures its parent directory exists first.
 */
function writeFileSafe(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

/**
 * Copies a directory recursively, skipping node_modules and .git.
 */
function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;

  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });

    for (const item of fs.readdirSync(src)) {
      if (item === "node_modules" || item === ".git") continue;
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

/**
 * Prints usage help for the CLI.
 */
function printUsage() {
  console.log(`
SG CLI Usage:

  sg new app <app-name>
  sg new gc <name>
  sg new cc <name>
  sg new svc <name>
  sg new ctx <name>

Convenience alias also supported:
  sg new <app-name>

Examples:
  sg new app canna-core-420
  sg new canna-core-420
  sg new gc video-card
  sg new svc auth-service
  sg new ctx user-session
`);
}

/**
 * Creates a service file inside src/services.
 */
function createService(serviceName) {
  const finalName = toPascalCase(serviceName);
  const servicePath = path.join(
    process.cwd(),
    "src",
    "services",
    `${finalName}.js`,
  );

  const content = `/**
 * File: src/services/${finalName}.js
 * Purpose: Service module stub for ${finalName}.
 */

export default function ${finalName}() {
  return null;
}
`;

  writeFileSafe(servicePath, content);
  console.log(`✅ Service created at src/services/${finalName}.js`);
}

/**
 * Creates a context file inside src/contexts.
 */
function createContext(contextName) {
  const finalName = toPascalCase(contextName);
  const ctxPath = path.join(
    process.cwd(),
    "src",
    "contexts",
    `${finalName}.js`,
  );

  const content = `/**
 * File: src/contexts/${finalName}.js
 * Purpose: React context definition for ${finalName}.
 */

import { createContext } from "react";

export const ${finalName} = createContext(null);
`;

  writeFileSafe(ctxPath, content);
  console.log(`✅ Context created at src/contexts/${finalName}.js`);
}

/**
 * Creates a component folder with JSX, child JSX, and CSS.
 */
function createComponent(componentName) {
  const finalName = toPascalCase(componentName);
  const cssClass = toCssClassName(finalName);
  const componentDir = path.join(process.cwd(), "src", "components", finalName);

  const jsxContent = `/**
 * File: src/components/${finalName}/${finalName}.jsx
 * Purpose: Main component file for ${finalName}.
 */

import React from "react";
import "./${finalName}.css";
import ${finalName}JS from "./${finalName}JS";

const ${finalName} = () => {
  return (
    <div className="${cssClass}-container">
      <h2>${finalName} Component</h2>
      <${finalName}JS />
    </div>
  );
};

export default ${finalName};
`;

  const childContent = `/**
 * File: src/components/${finalName}/${finalName}JS.jsx
 * Purpose: Child helper component for ${finalName}.
 */

import React from "react";

const ${finalName}JS = () => {
  return (
    <div className="${cssClass}-js">
      <p>This is the ${finalName}JS child component.</p>
    </div>
  );
};

export default ${finalName}JS;
`;

  const cssContent = `/**
 * File: src/components/${finalName}/${finalName}.css
 * Purpose: Styling for ${finalName} and its child component.
 */

.${cssClass}-container {
  border: 2px solid #ffd700;
  padding: 20px;
  margin: 10px;
  background-color: #1f2a48;
  color: #f8f9fc;
  border-radius: 8px;
}

.${cssClass}-js {
  margin-top: 10px;
  padding: 10px;
  background-color: #2a3a6a;
  color: #ffd700;
  border-radius: 6px;
}
`;

  writeFileSafe(path.join(componentDir, `${finalName}.jsx`), jsxContent);
  writeFileSafe(path.join(componentDir, `${finalName}JS.jsx`), childContent);
  writeFileSafe(path.join(componentDir, `${finalName}.css`), cssContent);

  console.log(
    `✅ Component '${finalName}' created at src/components/${finalName}`,
  );
}

/**
 * Creates a full app scaffold from the template folder and then writes
 * required project files with correct names and values.
 */
function createApp(rawAppName) {
  const projectDirName = toKebabCase(rawAppName);
  const displayName = toPascalCase(rawAppName);
  const packageName = toKebabCase(rawAppName);

  const root = process.cwd();
  const projectDir = path.join(root, projectDirName);
  const templateDir = path.join(__dirname, "../template");

  if (!rawAppName) {
    console.error("❌ Please provide an app name.");
    console.error("Example: sg new app canna-core-420");
    process.exit(1);
  }

  if (fs.existsSync(projectDir)) {
    console.error(`❌ Folder already exists: ${projectDirName}`);
    process.exit(1);
  }

  fs.mkdirSync(projectDir, { recursive: true });

  if (fs.existsSync(templateDir)) {
    copyRecursive(templateDir, projectDir);
  } else {
    console.warn(
      "⚠️ Template directory not found. Creating base app files only.",
    );
  }

  const publicDir = path.join(projectDir, "public");
  const srcDir = path.join(projectDir, "src");
  const templatePublicDir = path.join(templateDir, "public");

  fs.mkdirSync(publicDir, { recursive: true });
  fs.mkdirSync(srcDir, { recursive: true });

  // Copy public assets if they exist in template/public
  ["favicon.png", "logo.png"].forEach((file) => {
    const srcPath = path.join(templatePublicDir, file);
    const destPath = path.join(publicDir, file);

    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
    }
  });

  const manifestContent = `{
  "name": "${displayName}",
  "short_name": "${displayName}",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#0a0f24",
  "theme_color": "#ffd700"
}
`;

  writeFileSafe(path.join(publicDir, "manifest.json"), manifestContent);

  const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- File: index.html -->
    <!-- Purpose: Root HTML document for the generated Vite application. -->
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="manifest" href="/manifest.json" />
    <title>${displayName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`;

  writeFileSafe(path.join(projectDir, "index.html"), indexHtmlContent);

  const mainJsxContent = `/**
 * File: src/main.jsx
 * Purpose: Entry point for the React application. Mounts App into the root DOM node.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;

  writeFileSafe(path.join(srcDir, "main.jsx"), mainJsxContent);

  const appJsxContent = `/**
 * File: src/App.jsx
 * Purpose: Main root component for the generated SG application.
 */

import React from "react";
import "./App.css";

const App = () => {
  return (
    <div className="app-container">
      <h1>Welcome to ${displayName}</h1>
      <p>Your SG app is ready.</p>
      <p>
        Powered by{" "}
        <a
          href="https://consciousneurons.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Conscious Neurons LLC
        </a>
        {" "} | Sponsored by{" "}
        <a
          href="https://albagoldsystems.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Alba Gold
        </a>
      </p>
    </div>
  );
};

export default App;
`;

  writeFileSafe(path.join(srcDir, "App.jsx"), appJsxContent);

  const appCssContent = `/**
 * File: src/App.css
 * Purpose: Base styling for the generated SG application shell.
 */

body {
  margin: 0;
  font-family: Inter, sans-serif;
  background-color: #0a0f24;
  color: #f8f9fc;
}

a {
  color: #ffd700;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.app-container {
  display: flex;
  min-height: 100vh;
  padding: 32px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
`;

  writeFileSafe(path.join(srcDir, "App.css"), appCssContent);

  const generatedPkg = {
    name: packageName,
    version: "1.0.0",
    private: true,
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
      "react-router-dom": "^6.28.0",
    },
    devDependencies: {
      vite: "^7.2.7",
      "@vitejs/plugin-react": "^4.3.3",
    },
  };

  writeFileSafe(
    path.join(projectDir, "package.json"),
    `${JSON.stringify(generatedPkg, null, 2)}\n`,
  );

  const runJsContent = `#!/usr/bin/env node

/**
 * File: run.js
 * Purpose: Starts the generated Vite app through a custom launcher on port 4321.
 */

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

🚀 SG CLI - Powered by Conscious Neurons LLC
https://consciousneurons.com
Built by Salman Saeed
🔹 Starting your SG App...
\`);

let configPath = path.resolve("./ag.config.js");

if (os.platform() === "win32") {
  configPath = configPath.replace(/\\\\/g, "/");
}

const command = os.platform() === "win32" ? "npx.cmd" : "npx";
const viteArgs = ["vite", "--port", "4321"];

if (configPath) {
  viteArgs.push("--config", configPath);
}

const vite = spawn(command, viteArgs, {
  stdio: "inherit",
  shell: os.platform() === "win32"
});

vite.on("close", (code) => {
  process.exit(code ?? 0);
});
`;

  writeFileSafe(path.join(projectDir, "run.js"), runJsContent);

  // Add ag.config.js only if it does not already exist from the template
  const agConfigPath = path.join(projectDir, "ag.config.js");
  if (!fs.existsSync(agConfigPath)) {
    const agConfigContent = `/**
 * File: ag.config.js
 * Purpose: Vite configuration file used by the custom SG launcher.
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()]
});
`;
    writeFileSafe(agConfigPath, agConfigContent);
  }

  console.log("\\n📦 Installing dependencies...");
  try {
    execSync("npm install", { stdio: "inherit", cwd: projectDir });
    console.log("✅ Dependencies installed successfully!");
  } catch {
    console.error(
      "❌ Failed to install dependencies. Run 'npm install' manually.",
    );
  }

  console.log("\\n🎉 Project created successfully!");
  console.log(`cd ${projectDirName}`);
  console.log("npm run dev");
  console.log("npm run build");
  console.log("npm run preview");
}

/**
 * Parses arguments and supports both:
 *   sg new app my-app
 *   sg new my-app
 */
function parseArgs(argv) {
  const first = argv[0];
  const second = argv[1];
  const third = argv[2];

  if (!first) {
    printUsage();
    process.exit(1);
  }

  // Preferred form: sg new app my-app
  if (first === "new" && ["app", "gc", "cc", "svc", "ctx"].includes(second)) {
    return {
      command: first,
      shortcut: second,
      name: third,
    };
  }

  // Convenience alias: sg new my-app  -> sg new app my-app
  if (
    first === "new" &&
    second &&
    !["app", "gc", "cc", "svc", "ctx"].includes(second)
  ) {
    return {
      command: "new",
      shortcut: "app",
      name: second,
    };
  }

  // Optional direct form: sg app my-app
  if (["app", "gc", "cc", "svc", "ctx"].includes(first)) {
    return {
      command: "new",
      shortcut: first,
      name: second,
    };
  }

  printUsage();
  process.exit(1);
}

const { shortcut, name } = parseArgs(args);

switch (shortcut) {
  case "svc":
    if (!name) {
      console.error("❌ Please provide a service name.");
      process.exit(1);
    }
    createService(name);
    break;

  case "ctx":
    if (!name) {
      console.error("❌ Please provide a context name.");
      process.exit(1);
    }
    createContext(name);
    break;

  case "gc":
  case "cc":
    if (!name) {
      console.error("❌ Please provide a component name.");
      process.exit(1);
    }
    createComponent(name);
    break;

  case "app":
    if (!name) {
      console.error("❌ Please provide an app name.");
      process.exit(1);
    }
    createApp(name);
    break;

  default:
    console.error("❌ Unknown shortcut.");
    printUsage();
    process.exit(1);
}
