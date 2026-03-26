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
 * Purpose: Convert a string like "my-app" or "my_app" to PascalCase.
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
 * Purpose: Convert a string to kebab-case for folder/package names.
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
 * Purpose: Convert a string into a safe CSS class prefix.
 */
function toCssClassName(str = "") {
  return toKebabCase(str).replace(/[^a-z0-9-]/g, "");
}

/**
 * Purpose: Ensure parent directories exist before writing a file.
 */
function writeFileSafe(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

/**
 * Purpose: Recursively copy directories and files, skipping junk folders.
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
 * Purpose: Print usage help.
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
 * Purpose: Create a service file in src/services.
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
 * Purpose: Create a context file in src/contexts.
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
 * Purpose: Create a component folder with JSX, child JSX, and CSS.
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
 * Purpose: Create a full app scaffold from the template folder and then
 * patch key files with the correct app-specific values.
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

  if (!fs.existsSync(templateDir)) {
    console.error("❌ Template directory not found.");
    console.error(`Expected template at: ${templateDir}`);
    process.exit(1);
  }

  if (fs.existsSync(projectDir)) {
    console.error(`❌ Folder already exists: ${projectDirName}`);
    process.exit(1);
  }

  fs.mkdirSync(projectDir, { recursive: true });

  // Copy the full template first
  copyRecursive(templateDir, projectDir);

  const publicDir = path.join(projectDir, "public");
  const srcDir = path.join(projectDir, "src");

  fs.mkdirSync(publicDir, { recursive: true });
  fs.mkdirSync(srcDir, { recursive: true });

  // Ensure root index.html exists by promoting template/public/index.html
  const publicIndexPath = path.join(publicDir, "index.html");
  const rootIndexPath = path.join(projectDir, "index.html");

  if (fs.existsSync(publicIndexPath)) {
    const templateIndex = fs.readFileSync(publicIndexPath, "utf8");
    const patchedIndex = templateIndex
      .replace(/<title>.*?<\/title>/i, `<title>${displayName}</title>`)
      .replace(/src=["']\.\/src\/main\.jsx["']/i, 'src="/src/main.jsx"')
      .replace(/src=["']src\/main\.jsx["']/i, 'src="/src/main.jsx"');

    writeFileSafe(rootIndexPath, patchedIndex);
    fs.unlinkSync(publicIndexPath);
  } else if (!fs.existsSync(rootIndexPath)) {
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
    writeFileSafe(rootIndexPath, indexHtmlContent);
  }

  // Ensure manifest exists and has the right app name
  const manifestPath = path.join(publicDir, "manifest.json");
  const manifestContent = `{
  "name": "${displayName}",
  "short_name": "${displayName}",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#0a0f24",
  "theme_color": "#ffd700"
}
`;
  writeFileSafe(manifestPath, manifestContent);

  // Ensure package.json is correct for the generated app
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
      "react-router-dom": "^6.15.0",
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

  // Ensure main.jsx exists
  const mainJsxPath = path.join(srcDir, "main.jsx");
  if (!fs.existsSync(mainJsxPath)) {
    const mainJsxContent = `/**
 * File: src/main.jsx
 * Purpose: Entry point for the React application. Mounts App into the root DOM node.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;
    writeFileSafe(mainJsxPath, mainJsxContent);
  }

  // Ensure App.jsx exists
  const appJsxPath = path.join(srcDir, "App.jsx");
  if (!fs.existsSync(appJsxPath)) {
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
    writeFileSafe(appJsxPath, appJsxContent);
  }

  // Ensure App.css exists
  const appCssPath = path.join(srcDir, "App.css");
  if (!fs.existsSync(appCssPath)) {
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
    writeFileSafe(appCssPath, appCssContent);
  }

  // Ensure run.js exists
  const runJsPath = path.join(projectDir, "run.js");
  if (!fs.existsSync(runJsPath)) {
    const runJsContent = `#!/usr/bin/env node

/**
 * File: run.js
 * Purpose: Starts the generated Vite app through a custom launcher on port 4321.
 */

import { spawn } from "child_process";
import path from "path";
import os from "os";
import fs from "fs";

console.log(\`
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
\`);

const localConfigPath = path.resolve("./as.config.js");
const hasLocalConfig = fs.existsSync(localConfigPath);

const command = os.platform() === "win32" ? "npx.cmd" : "npx";
const viteArgs = ["vite", "--port", "4321"];

if (hasLocalConfig) {
  viteArgs.push("--config", localConfigPath);
}

const vite = spawn(command, viteArgs, {
  stdio: "inherit",
  shell: os.platform() === "win32"
});

vite.on("close", (code) => {
  console.log(\`\\n✅ SG App stopped (exit code \${code ?? 0})\`);
  process.exit(code ?? 0);
});
`;
    writeFileSafe(runJsPath, runJsContent);
  }

  // Ensure as.config.js exists
  const asConfigPath = path.join(projectDir, "as.config.js");
  if (!fs.existsSync(asConfigPath)) {
    const asConfigContent = `/**
 * File: as.config.js
 * Purpose: Vite configuration file used by the custom SG launcher.
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()]
});
`;
    writeFileSafe(asConfigPath, asConfigContent);
  }

  console.log("\n📦 Installing dependencies...");
  try {
    execSync("npm install", { stdio: "inherit", cwd: projectDir });
    console.log("✅ Dependencies installed successfully!");
  } catch {
    console.error(
      "❌ Failed to install dependencies. Run 'npm install' manually.",
    );
  }

  console.log("\n🎉 Project created successfully!");
  console.log(`cd ${projectDirName}`);
  console.log("npm run dev");
  console.log("npm run build");
  console.log("npm run preview");
}

/**
 * Purpose: Parse command arguments and support:
 *   sg new app my-app
 *   sg new my-app
 *   sg app my-app
 */
function parseArgs(argv) {
  const first = argv[0];
  const second = argv[1];
  const third = argv[2];

  if (!first) {
    printUsage();
    process.exit(1);
  }

  if (first === "new" && ["app", "gc", "cc", "svc", "ctx"].includes(second)) {
    return {
      shortcut: second,
      name: third,
    };
  }

  if (
    first === "new" &&
    second &&
    !["app", "gc", "cc", "svc", "ctx"].includes(second)
  ) {
    return {
      shortcut: "app",
      name: second,
    };
  }

  if (["app", "gc", "cc", "svc", "ctx"].includes(first)) {
    return {
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
