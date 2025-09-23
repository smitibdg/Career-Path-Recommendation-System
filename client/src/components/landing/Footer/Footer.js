import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  // 🎯 REPLACE THESE WITH YOUR ACTUAL INFORMATION
  const developerInfo = {
    name: "Smiti Badugu",
    email: "smitibadugu08@gmail.com",
    portfolio: "https://smiti-portfolio.com",
    github: "https://github.com/smitibdg",
    linkedin: "https://www.linkedin.com/in/smiti-badugu-8313a9211/"
  };


  return (
    <footer className="footer">
      <div className="container">
        {/* Developer Credits Section */}
        <div className="developer-credits">
          <div className="developer-info">
            <div className="developer-avatar">
              <span className="avatar-icon">👨‍💻</span>
            </div>
            <div className="developer-details">
              <h4 className="developer-name">Developed by Smiti Badugu</h4>
              <p className="developer-title">Data Science Student & AI/ML Enthusiast</p>
              <div className="developer-skills">
                <span className="skill-tag">React.js</span>
                <span className="skill-tag">Node.js</span>
                <span className="skill-tag">Python</span>
                <span className="skill-tag">Machine Learning</span>
                <span className="skill-tag">UI/UX Design</span>
              </div>
              <div className="developer-links">
                <a href={developerInfo.portfolio} 
                className="dev-link portfolio" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Visit Portfolio"
                >
                  <span className="link-icon">🌐</span>
                  Portfolio
                </a>
                
                <a href={developerInfo.github}
                className="dev-link github" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Visit GitHub Profile"
                >
                  <span className="link-icon">💻</span>
                  GitHub
                </a>
                <a href={developerInfo.linkedin} className="dev-link linkedin" target="_blank" rel="noopener noreferrer" aria-label="Visit LinkedIn Profile">
                  <span className="link-icon">💼</span>
                  LinkedIn
                </a>
                <a href={`mailto:${developerInfo.email}?subject=Career Path Project Inquiry&body=Hi ${developerInfo.name},%0A%0AI found your Career Path Recommendation System project and would like to connect!`} 
                className="dev-link email" aria-label="Send Email">
                  <span className="link-icon">📧</span>
                  Email
                </a>
              </div>
            </div>
          </div>
          <div className="project-info">
            <div className="project-stats">
              <div className="stat-item">
                <span className="stat-value">5</span>
                <span className="stat-label">Assessment Types</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">100+</span>
                <span className="stat-label">Questions</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">AI-Powered</span>
                <span className="stat-label">Recommendations</span>
              </div>
            </div>
            <div className="tech-stack">
              <h5>Built with Modern Technologies</h5>
              <div className="tech-icons">
                <span className="tech-icon" title="React.js">⚛️</span>
                <span className="tech-icon" title="JavaScript">🟨</span>
                <span className="tech-icon" title="CSS3">🎨</span>
                <span className="tech-icon" title="HTML5">📄</span>
                <span className="tech-icon" title="Node.js">🟢</span>
                <span className="tech-icon" title="Python">🐍</span>
                <span className="tech-icon" title="Machine Learning">🤖</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright-section">
              <p>&copy; 2024 CareerPath Recommendation System. All rights reserved.</p>
              <p>Made with ❤️ for confused students everywhere</p>
            </div>
            <div className="project-badge">
              <span className="badge-text">🎓 Final Year Project</span>
              <span className="badge-year">2025-26</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;