import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <h2 className="notfound-subtitle">Oops! Page Not Found</h2>
      <p className="notfound-text">
        The page you’re looking for doesn’t exist or may have been moved.
      </p>
      <Link to="/" className="notfound-link">
        Return to Home
      </Link>
    </div>
  );
}