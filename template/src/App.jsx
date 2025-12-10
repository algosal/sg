import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import MeetSalman from "./components/MeetSalman";
import Corporate from "./components/Corporate";
import SgCli from "./components/SgCli/SgCli";

const App = () => {
  return (
    <div className="app-container">
      <Navbar />

      {/* Header no longer fixed */}
      <header className="app-header">
        <img src="./logo.png" alt="AG Logo" className="app-logo" />
        <h1 className="app-title">Welcome to Your SG App</h1>
        <p className="app-subtitle">
          Powered by{" "}
          <a
            href="https://consciousneurons.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Conscious Neurons LLC
          </a>{" "}
          | Sponsored by{" "}
          <a
            href="https://albagoldsystems.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Alba Gold
          </a>
        </p>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/meet-salman" element={<MeetSalman />} />
          <Route path="/corporate" element={<Corporate />} />
          <Route path="/" element={<SgCli />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
