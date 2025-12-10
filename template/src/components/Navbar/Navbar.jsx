import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [menuOpen, setMenuOpen] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="nav-wrapper">
      {isMobile && (
        <div className="nav-mobile-header">
          <button
            className="nav-hamburger"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <div
              className={
                menuOpen ? "nav-bar nav-bar1 open" : "nav-bar nav-bar1"
              }
            ></div>
            <div
              className={
                menuOpen ? "nav-bar nav-bar2 open" : "nav-bar nav-bar2"
              }
            ></div>
            <div
              className={
                menuOpen ? "nav-bar nav-bar3 open" : "nav-bar nav-bar3"
              }
            ></div>
          </button>
        </div>
      )}
      {/* Desktop Sidebar */}
      {!isMobile && (
        <ul className="nav-links nav-sidebar">
          <li>
            <NavLink to="/">SG</NavLink>
          </li>
          <li>
            <NavLink to="/meet-salman" end>
              Meet Salman
            </NavLink>
          </li>
          <li>
            <NavLink to="/corporate">Corporate</NavLink>
          </li>
        </ul>
      )}
      {/* Mobile Modal Menu */}
      {isMobile && menuOpen && (
        <div className="nav-mobile-modal">
          <ul className="nav-links nav-modal-links">
            <li>
              <NavLink to="/" onClick={toggleMenu}>
                SG CLI
              </NavLink>
            </li>

            <li>
              <NavLink to="/meet-salman" end onClick={toggleMenu}>
                Meet Salman
              </NavLink>
            </li>
            <li>
              <NavLink to="/corporate" onClick={toggleMenu}>
                Corporate
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
