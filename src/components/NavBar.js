import React from "react";
import "./NavBar.css";

function NavBar() {
  return (
    <div className="navbar">
      <div className="navbar-title">
        <a href="/">Artnook</a>
      </div>
      <div className="nav-right">
      <a href="/Create">
        <button className="nav-buttons">
          <i className="fa-solid fa-brush"></i>
        </button>
      </a>
      <a href="/Explore">
        <button className="nav-buttons">
          <i className="fa-solid fa-images"></i>
        </button>
      </a>
      <a
        href="https://github.com/shyamsundar-10/artnook"
        target="_blank"
        rel="noopener noreferrer"
        className="github-link"
      >
        <button className="github-button">
          <i className="fa-brands fa-github"></i> shyamsundar-10
        </button>
      </a>
      </div>
    </div>
  );
}

export default NavBar;
