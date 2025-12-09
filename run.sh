#!/bin/zsh

# Navigate to the script's directory
cd "$(dirname "$0")"

echo "🟢 Creating AG template folder structure..."

# Create folders
mkdir -p template/src/{components,contexts,services}

# Create package.json
cat > template/package.json <<EOL
{
  "name": "template",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0"
  }
}
EOL

# Create index.html
cat > template/index.html <<EOL
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

# Create main.jsx
cat > template/src/main.jsx <<EOL
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOL

# Create App.jsx
cat > template/src/App.jsx <<EOL
import React from "react";

function App() {
  return (
    <div>
      <h1>Hello from AG Template!</h1>
    </div>
  );
}

export default App;
EOL

# Create empty CSS
touch template/src/index.css

echo "✅ AG template folder successfully created!"
