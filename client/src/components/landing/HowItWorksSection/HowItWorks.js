import React from 'react';
import './HowItWorks.css';

const HowItWorks = ({ onLoginClick, onSignupClick }) => {

  const steps = [
    {
      step: '01',
      title: 'Create Your Profile',
      description: 'Sign up and complete your basic profile with personal and educational information.',
      icon: '👤'
    },
    {
      step: '02',
      title: 'Take Assessments',
      description: 'Complete 5 comprehensive tests covering personality, skills, cognitive abilities, and values.',
      icon: '📝'
    },
    {
      step: '03',
      title: 'Get AI Analysis',
      description: 'Our machine learning algorithms analyze your responses to determine your career clusters.',
      icon: '🤖'
    },
    {
      step: '04',
      title: 'Receive Recommendations',
      description: 'Get personalized career recommendations with detailed information and confidence scores.',
      icon: '🎯'
    },
    {
      step: '05',
      title: 'Explore Resources',
      description: 'Access learning materials, courses, and guidance to pursue your recommended career path.',
      icon: '📚'
    }
  ];

  return (
    <section className="how-it-works-section">
      <div className="container">
        <div className="how-it-works-header">
          <h2>How It Works</h2>
          <p>
            Follow these simple steps to discover your perfect career path through our 
            scientifically-backed assessment process.
          </p>
        </div>

        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-number">{step.step}</div>
              <div className="step-icon">{step.icon}</div>
              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
              {index < steps.length - 1 && <div className="step-connector"></div>}
            </div>
          ))}
        </div>

        <div className="how-it-works-cta">
          <h3>Ready to get started?</h3>
          <p>It takes less than 30 minutes to complete all assessments</p>
            <div className="cta-buttons">
              <button onClick={onSignupClick} className="btn btn-primary btn-large">
                Begin Your Journey
              </button>

              <button onClick={onLoginClick} className="btn btn-primary btn-large">
                Already have an account?
              </button>
            </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;