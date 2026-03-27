import React from "react";
import "../index.css";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Column 1 */}
        <div className="footer-column">
          <h2>About Us</h2>
          <p>
            This platform provides students access to course materials uploaded by lecturers,
            making learning flexible, organized, and accessible anywhere.
          </p>
        </div>

        {/* Column 2 */}
        
        <div className="footer-column">
          <h2>Quick Links</h2>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </div>

     
        

      </div>

      {/* Copyright section */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} E-Learning Repository. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
