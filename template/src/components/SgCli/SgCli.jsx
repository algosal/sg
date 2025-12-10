import React from "react";
import Navbar from "../Navbar/Navbar";
import "./SgCli.css";

const SgCli = () => {
  return (
    <div className="sgcli-container">
      <Navbar />

      <header className="sgcli-header">
        SG CLI – Streamlined React Vite Apps
      </header>

      <main className="sgcli-content">
        <section className="sgcli-section">
          <h2 className="sgcli-section-title">About SG CLI</h2>
          <p className="sgcli-text">
            SG CLI is a powerful command-line interface created by Salman Saeed.
            It combines the familiar folder structure and command patterns from
            Angular with the modern principles of React and Vite, providing a
            ready-to-use boilerplate for web applications. SG CLI comes with
            built-in navigation and project scaffolding, reducing setup overhead
            and making it ideal for developing regular applications efficiently.
          </p>
        </section>

        <section className="sgcli-section">
          <h2 className="sgcli-section-title">Installation</h2>
          <pre className="sgcli-code">npm install -g sg-cli</pre>
        </section>

        <section className="sgcli-section">
          <h2 className="sgcli-section-title">Core Commands</h2>
          <ul className="sgcli-list">
            <li>
              <code>sg new app &lt;app-name&gt;</code> – Initialize a new React
              Vite app with Angular-style structure
            </li>
            <li>
              <code>sg new gc &lt;component-name&gt;</code> – Create a Game
              Component
            </li>
            <li>
              <code>sg new cc &lt;component-name&gt;</code> – Create a Commerce
              Component
            </li>
            <li>
              <code>sg new svc &lt;service-name&gt;</code> – Create a Service
            </li>
            <li>
              <code>sg new ctx &lt;context-name&gt;</code> – Create a React
              Context
            </li>
            <li>
              <code>sg dev</code> – Start the development server
            </li>
            <li>
              <code>sg build</code> – Build the project for production
            </li>
            <li>
              <code>sg deploy</code> – Deploy the project to your hosting
              environment
            </li>
          </ul>
        </section>

        <section className="sgcli-section">
          <h2 className="sgcli-section-title">Advanced Options</h2>
          <p className="sgcli-text">
            SG CLI supports additional flags to customize your app setup:
          </p>
          <pre className="sgcli-code">
            sg new app &lt;app-name&gt; --typescript --tailwind
          </pre>
        </section>

        <section className="sgcli-section">
          <h2 className="sgcli-section-title">Tips for Effective Use</h2>
          <ul className="sgcli-list">
            <li>
              Run <code>sg dev</code> for fast hot-reloading during development.
            </li>
            <li>
              Use <code>sg update</code> to keep dependencies and boilerplate
              up-to-date.
            </li>
            <li>
              Check <code>sg help</code> for a full list of available commands.
            </li>
          </ul>
        </section>

        <section className="sgcli-section">
          <h2 className="sgcli-section-title">Why SG CLI?</h2>
          <p className="sgcli-text">
            By merging Angular-style structure and commands with React Vite’s
            lightweight approach, SG CLI provides developers with a robust,
            flexible, and minimal setup. It comes ready with routing,
            navigation, and a folder structure that scales with projects, making
            it the perfect starting point for many regular applications.
          </p>
        </section>

        <section className="sgcli-section">
          <h2 className="sgcli-section-title">Authorship</h2>
          <p className="sgcli-text">
            SG CLI is built and maintained by <strong>Salman Saeed</strong>. For
            more information, visit{" "}
            <a
              href="https://consciousneurons.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Conscious Neurons LLC
            </a>
            .
          </p>
        </section>
      </main>
    </div>
  );
};

export default SgCli;
