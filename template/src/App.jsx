import React from "react";
import "./App.css"; // Import the default CSS

const App = () => {
  return (
    <div className="app-container">
      <header className="app-header">
        <img src="./logo.png" alt="AG Logo" className="app-logo" />
        <h1>Welcome to Your AG App</h1>
        <p>
          Powered by{" "}
          <a href="https://consciousneurons.com">Conscious Neurons LLC</a> |
          Sponsored by <a href="https://albagoldsystems.com">Alba Gold</a>
        </p>
      </header>
    </div>
  );
};

export default App;
