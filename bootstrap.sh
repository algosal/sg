#!/bin/zsh

echo "🚀 AG CLI Bootstrap Script Starting..."
echo "--------------------------------------"

# AUTO-DETECT ROOT DIRECTORY OF ag-cli
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
echo "📁 Root detected at: $ROOT_DIR"

# CREATE TEMPLATE DIRECTORY
echo "📁 Creating template/ structure..."
mkdir -p "$ROOT_DIR/template/src/components"
mkdir -p "$ROOT_DIR/template/src/contexts"
mkdir -p "$ROOT_DIR/template/src/services"

# CREATE index.html
cat > "$ROOT_DIR/template/index.html" <<EOL
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AG App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
EOL
echo "📝 index.html created."

# CREATE main.jsx
cat > "$ROOT_DIR/template/src/main.jsx" <<EOL
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOL
echo "📝 main.jsx created."

# CREATE App.jsx
cat > "$ROOT_DIR/template/src/App.jsx" <<EOL
function App() {
  return (
    <div>
      <h1>Hello from AG Template!</h1>
    </div>
  );
}

export default App;
EOL
echo "📝 App.jsx created."

# CREATE index.css
touch "$ROOT_DIR/template/src/index.css"
echo "📝 index.css created."

# CREATE CUSTOM AG CONFIG
cat > "$ROOT_DIR/template/ag.config.js" <<EOL
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4321, // AG default port
  },
  build: {
    outDir: "dist",
  },
});
EOL
echo "⚙️ Custom AG config created: ag.config.js"

# MODIFY package.json TO ADD A DEV SCRIPT
PKG="$ROOT_DIR/package.json"

if [ -f "$PKG" ]; then
  echo "🛠 Updating package.json with dev script..."
  tmpfile=$(mktemp)

  node <<EOF > "$tmpfile"
import { readFileSync, writeFileSync } from "fs";

const pkg = JSON.parse(readFileSync("$PKG"));

pkg.scripts = pkg.scripts || {};
pkg.scripts.dev = "vite --config template/ag.config.js";

writeFileSync("$PKG", JSON.stringify(pkg, null, 2));
EOF

  mv "$tmpfile" "$PKG"
  echo "✔️ package.json updated."
else
  echo "⚠️ No package.json found! Did you run 'npm init -y'?"
fi

echo "🎉 AG CLI Bootstrap Complete!"
echo "--------------------------------------"
echo "Run your template with:"
echo ""
echo "   npm run dev"
echo ""
