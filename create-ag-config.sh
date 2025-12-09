#!/bin/zsh

echo "⚙️  Creating AG config file..."

# Ensure template folder exists
mkdir -p template

# Create the Vite config
cat > template/ag.config.js << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4321,      // AG default port
    open: true       // Auto-open browser
  },
  build: {
    outDir: "dist"
  }
});
EOF

echo "✅ ag.config.js created at template/ag.config.js"
echo "To run:  npx vite --config template/ag.config.js"
