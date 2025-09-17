import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">🎯</span>
              <span className="logo-text">CareerPath</span>
            </div>
            <p className="footer-description">
              Empowering students to discover their ideal career paths through 
              scientific assessment and intelligent recommendations.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="LinkedIn">💼</a>
              <a href="#" aria-label="Instagram">📷</a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/features">Features</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Resources</h4>
            <ul className="footer-links">
              <li><Link to="/career-guide">Career Guide</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/support">Support</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Legal</h4>
            <ul className="footer-links">
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/cookies">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 CareerPath Recommendation System. All rights reserved.</p>
          <p>Made with ❤️ for confused students everywhere</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;