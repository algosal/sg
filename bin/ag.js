#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);

if (args.length < 2) {
  console.log("Usage: ag <command> <name>");
  process.exit(1);
}

const command = args[0];
const name = args[1];

// Paths
const projectPath = path.join(process.cwd(), name);

const createProject = () => {
  console.log(`Creating new project: ${name}`);
  fs.cpSync(path.join(__dirname, "../template"), projectPath, {
    recursive: true,
  });
  console.log("Installing dependencies...");
  execSync("npm install", { cwd: projectPath, stdio: "inherit" });
  console.log("✔ Project created!");
};

const createComponent = () => {
  const compPath = path.join(process.cwd(), "src/components", name);
  if (!fs.existsSync(compPath)) fs.mkdirSync(compPath, { recursive: true });

  fs.writeFileSync(
    path.join(compPath, `${name}.jsx`),
    `import React from 'react';
import './${name}.css';

const ${name} = () => {
  return <div>${name} component</div>;
};

export default ${name};
`
  );
  fs.writeFileSync(
    path.join(compPath, `${name}JS.js`),
    `// Logic for ${name} component
`
  );
  fs.writeFileSync(
    path.join(compPath, `${name}.css`),
    `/* Styles for ${name} component */
`
  );
  console.log(`✔ Component ${name} created at src/components/${name}/`);
};

const createContext = () => {
  const ctxPath = path.join(process.cwd(), "src/contexts");
  if (!fs.existsSync(ctxPath)) fs.mkdirSync(ctxPath, { recursive: true });

  fs.writeFileSync(
    path.join(ctxPath, `${name}.js`),
    `import { createContext, useState } from 'react';

export const ${name} = createContext();

export const ${name}Provider = ({ children }) => {
  const [state, setState] = useState(null);

  return (
    <${name}.Provider value={{ state, setState }}>
      {children}
    </${name}.Provider>
  );
};
`
  );
  console.log(`✔ Context ${name} created at src/contexts/`);
};

const createService = () => {
  const srvPath = path.join(process.cwd(), "src/services");
  if (!fs.existsSync(srvPath)) fs.mkdirSync(srvPath, { recursive: true });

  fs.writeFileSync(
    path.join(srvPath, `${name}.js`),
    `class ${name} {
  async fetchSomething() {
    // API call
  }
}

export default new ${name}();
`
  );
  console.log(`✔ Service ${name} created at src/services/`);
};

switch (command) {
  case "new":
    createProject();
    break;
  case "nc":
    createComponent();
    break;
  case "cc":
    createContext();
    break;
  case "cs":
    createService();
    break;
  default:
    console.log("Unknown command");
    break;
}
