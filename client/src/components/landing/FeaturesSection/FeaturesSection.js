import React from 'react';
import './FeaturesSection.css';

const FeaturesSection = ({ onLoginClick, onSignupClick }) => {
  // Features data array
  const features = [
    {
      id: 1,
      icon: "🎯",
      title: "AI-Powered Recommendations",
      description: "Get personalized career suggestions based on advanced machine learning algorithms that analyze your skills, interests, and personality traits.",
      color: "#667eea"
    },
    {
      id: 2,
      icon: "📊",
      title: "Comprehensive Assessments",
      description: "Take detailed personality, cognitive, and skills assessments designed by career experts to understand your strengths and preferences.",
      color: "#764ba2"
    },
    {
      id: 3,
      icon: "🚀",
      title: "Career Path Mapping",
      description: "Visualize your career journey with step-by-step guidance, required skills, and educational pathways for your chosen field.",
      color: "#f093fb"
    },
    {
      id: 4,
      icon: "💼",
      title: "Industry Insights",
      description: "Access real-time job market data, salary information, and growth prospects for different career paths to make informed decisions.",
      color: "#f5576c"
    },
    {
      id: 5,
      icon: "👥",
      title: "Expert Mentorship",
      description: "Connect with industry professionals and career coaches who provide personalized guidance and support throughout your journey.",
      color: "#4ecdc4"
    },
    {
      id: 6,
      icon: "📈",
      title: "Progress Tracking",
      description: "Monitor your skill development, track completed assessments, and see how your career preferences evolve over time.",
      color: "#45b7d1"
    }
  ];

  return (
    <section id="features" className="features-section">
      <div className="container">
        {/* Section Header */}
        <div className="features-header">
          <h2>Powerful Features for Your Career Success</h2>
          <p>
            Discover our comprehensive suite of tools designed to help you 
            find your perfect career path and achieve your professional goals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          {features.map(feature => (
            <div 
              key={feature.id} 
              className="feature-card"
              style={{'--feature-color': feature.color}}
            >
              {/* Feature Icon */}
              <div className="feature-icon">
                <span className="icon">{feature.icon}</span>
              </div>
              
              {/* Feature Content */}
              <div className="feature-content">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="features-cta">
          <h3>Ready to Discover Your Perfect Career?</h3>
          <p>
            Join thousands of students who have found their dream careers 
            with our AI-powered recommendation system.
          </p>
          <button onClick={onLoginClick} className="cta-button" type="button">
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;