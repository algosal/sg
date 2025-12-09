#!/usr/bin/env node
import fs from "fs";
import path from "path";

// Read args
const args = process.argv.slice(2);
const shortcut = args[0]; // e.g., "gc"
const customName = args[1]; // optional custom name

// Define shortcut mappings for minimal components
const COMPONENTS = {
  gc: "SuperGame",
  cc: "CommerceComponent",
  ac: "AnalyticsComponent",
  ai: "AIComponent",
};

// Resolve final component name
const componentName = customName || COMPONENTS[shortcut];

if (!componentName) {
  console.log("Usage: npx ag-shortcuts <shortcut> [ComponentName]");
  console.log("Available shortcuts:", Object.keys(COMPONENTS).join(", "));
  process.exit(1);
}

// Paths
const ROOT = process.cwd();
const COMPONENT_DIR = path.join(ROOT, "src", "components", componentName);

// Create component folder
fs.mkdirSync(COMPONENT_DIR, { recursive: true });

// 1️⃣ SuperGame.jsx
const jsxContent = `import React from "react";
import "./${componentName}.css";
import ${componentName}JS from "./${componentName}JS";

const ${componentName} = () => {
  return (
    <div className="${componentName.toLowerCase()}-container">
      <h2>${componentName} Component</h2>
      <${componentName}JS />
    </div>
  );
};

export default ${componentName};
`;
fs.writeFileSync(path.join(COMPONENT_DIR, `${componentName}.jsx`), jsxContent);

// 2️⃣ SuperGameJS.jsx
const jsxChildContent = `import React from "react";

const ${componentName}JS = () => {
  return (
    <div className="${componentName.toLowerCase()}-js">
      <p>This is the ${componentName}JS child component!</p>
    </div>
  );
};

export default ${componentName}JS;
`;
fs.writeFileSync(
  path.join(COMPONENT_DIR, `${componentName}JS.jsx`),
  jsxChildContent
);

// 3️⃣ SuperGame.css
const cssContent = `.${componentName.toLowerCase()}-container {
  border: 2px solid #ffd700;
  padding: 20px;
  margin: 10px;
  background-color: #1f2a48;
  color: #f8f9fc;
  border-radius: 8px;
}

.${componentName.toLowerCase()}-js {
  margin-top: 10px;
  padding: 10px;
  background-color: #2a3a6a;
  color: #ffd700;
  border-radius: 6px;
}
`;
fs.writeFileSync(path.join(COMPONENT_DIR, `${componentName}.css`), cssContent);

console.log(
  `✔ Component '${componentName}' created at src/components/${componentName}`
);
