import React from 'react';
import './HeroSection.css';

const HeroSection = ({ onLoginClick, onSignupClick }) => {

  return (
    <section className="hero-section">
      <div className="hero-background">
        <div className="hero-shape hero-shape-1"></div>
        <div className="hero-shape hero-shape-2"></div>
        <div className="hero-shape hero-shape-3"></div>
      </div>
      
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Discover Your <span className="highlight">Perfect Career</span> Path
            </h1>
            <p className="hero-subtitle">
              Take our comprehensive assessment to unlock personalized career recommendations 
              based on your personality, skills, and interests. Start your journey to a 
              fulfilling career today.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">10,000+</span>
                <span className="stat-label">Students Helped</span>
              </div>
              <div className="stat">
                <span className="stat-number">100+</span>
                <span className="stat-label">Career Paths</span>
              </div>
              <div className="stat">
                <span className="stat-number">95%</span>
                <span className="stat-label">Success Rate</span>
              </div>
            </div>
            
            {/* Buttons now trigger modals instead of navigation */}
            <div className="hero-actions">
              <button onClick={onSignupClick} className="btn btn-secondary btn-large">
                Start Free Assessment
              </button>
              <button onClick={onLoginClick} className="btn btn-secondary btn-large">
                Already have account?
              </button>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="hero-illustration">
              <div className="illustration-element career-icon">🎯</div>
              <div className="illustration-element brain-icon">🧠</div>
              <div className="illustration-element chart-icon">📊</div>
              <div className="illustration-element lightbulb-icon">💡</div>
              <div className="illustration-element graduation-icon">🎓</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;