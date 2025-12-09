#!/bin/zsh

# --------------------------------------
# AG CLI Folder Structure Generator
# --------------------------------------
# This script creates the standard folder structure
# for AG CLI projects:
#
# src/
#   components/
#     AnyComponent/
#       AnyComponent.jsx
#       AnyComponentJS.js
#       AnyComponent.css
#   contexts/
#   services/
# --------------------------------------

echo "🚀 Creating AG CLI project folder structure..."

# Auto-detect current working directory
ROOT_DIR="$(pwd)"
SRC_DIR="$ROOT_DIR/src"
COMPONENTS_DIR="$SRC_DIR/components"
CONTEXTS_DIR="$SRC_DIR/contexts"
SERVICES_DIR="$SRC_DIR/services"

# Create main folders
mkdir -p "$COMPONENTS_DIR"
mkdir -p "$CONTEXTS_DIR"
mkdir -p "$SERVICES_DIR"

echo "📁 src/ structure created."
echo "  - components/"
echo "  - contexts/"
echo "  - services/"

# Create example component
EXAMPLE_COMPONENT="ExampleComponent"
COMP_DIR="$COMPONENTS_DIR/$EXAMPLE_COMPONENT"
mkdir -p "$COMP_DIR"

# Example component files
cat > "$COMP_DIR/$EXAMPLE_COMPONENT.jsx" <<EOL
import React from 'react';
import './$EXAMPLE_COMPONENT.css';

function $EXAMPLE_COMPONENT() {
  return (
    <div className="$EXAMPLE_COMPONENT">
      <h2>Hello from $EXAMPLE_COMPONENT</h2>
    </div>
  );
}

export default $EXAMPLE_COMPONENT;
EOL

cat > "$COMP_DIR/$EXAMPLE_COMPONENTJS.js" <<EOL
// JavaScript logic for $EXAMPLE_COMPONENT
console.log('$EXAMPLE_COMPONENT JS loaded');
EOL

cat > "$COMP_DIR/$EXAMPLE_COMPONENT.css" <<EOL
/* CSS for $EXAMPLE_COMPONENT */
.$EXAMPLE_COMPONENT {
  padding: 10px;
  border: 1px solid #ffd700;
}
EOL

echo "📝 Example component '$EXAMPLE_COMPONENT' created in components/"

# Create example context
EXAMPLE_CONTEXT="ExampleContext"
cat > "$CONTEXTS_DIR/$EXAMPLE_CONTEXT.js" <<EOL
import { createContext, useState } from 'react';

const $EXAMPLE_CONTEXT = createContext();

export const $EXAMPLE_CONTEXTProvider = ({ children }) => {
  const [state, setState] = useState(null);

  return (
    <$EXAMPLE_CONTEXT.Provider value={{ state, setState }}>
      {children}
    </$EXAMPLE_CONTEXT.Provider>
  );
};

export default $EXAMPLE_CONTEXT;
EOL

echo "📝 Example context '$EXAMPLE_CONTEXT' created in contexts/"

# Create example service
EXAMPLE_SERVICE="ExampleService"
cat > "$SERVICES_DIR/$EXAMPLE_SERVICE.js" <<EOL
// $EXAMPLE_SERVICE handles API calls or business logic
export const fetchData = async () => {
  console.log('Fetching data from $EXAMPLE_SERVICE...');
};
EOL

echo "📝 Example service '$EXAMPLE_SERVICE' created in services/"

echo "🎉 AG CLI folder structure successfully created!"
