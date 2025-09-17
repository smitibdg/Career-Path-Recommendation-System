import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import FeatureCard from './FeatureCard';
import './FeaturesSection.css';

const FeaturesSection = ({ onLoginClick, onSignupClick }) => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: '🧠',
      title: 'Comprehensive Assessment',
      description: 'Take 5 detailed tests covering personality, cognitive abilities, skills, situational judgment, and values to get a complete picture of your potential.',
      highlights: ['Big Five Personality', 'Cognitive Abilities', 'Skills & Aptitude', 'Situational Judgment', 'Values & Motivation']
    },
    {
      icon: '🎯',
      title: 'AI-Powered Recommendations',
      description: 'Our advanced machine learning algorithms analyze your results to provide personalized career recommendations with confidence scores.',
      highlights: ['Machine Learning', 'Personalized Results', 'Confidence Scoring', 'Career Matching', 'Data-Driven Insights']
    },
    {
      icon: '📊',
      title: 'Detailed Career Insights',
      description: 'Get comprehensive information about recommended careers including salary expectations, growth prospects, and required skills.',
      highlights: ['Salary Information', 'Growth Prospects', 'Skill Requirements', 'Education Paths', 'Job Market Trends']
    },
    {
      icon: '📚',
      title: 'Learning Resources',
      description: 'Access curated learning resources, online courses, certifications, and books to help you prepare for your chosen career path.',
      highlights: ['Online Courses', 'Certifications', 'Books & Articles', 'Tools & Platforms', 'Networking Opportunities']
    },
    {
      icon: '🏛️',
      title: 'Government Exam Guidance',
      description: 'Get information about relevant government exams including UPSC, SSC, Banking, and other competitive examinations.',
      highlights: ['UPSC Preparation', 'SSC Exams', 'Banking Exams', 'State PSC', 'Other Competitive Exams']
    },
    {
      icon: '📈',
      title: 'Progress Tracking',
      description: 'Monitor your career development journey with detailed analytics and track your progress towards your career goals.',
      highlights: ['Progress Analytics', 'Goal Tracking', 'Skill Development', 'Achievement Badges', 'Career Milestones']
    }
  ];

  return (
    <section className="features-section">
      <div className="container">
        <div className="features-header">
          <h2>Why Choose Our Career Recommendation System?</h2>
          <p>
            Discover your perfect career path with our scientifically-backed assessment 
            and AI-powered recommendations designed specifically for Indian students.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              feature={feature} 
              index={index}
            />
          ))}
        </div>

        <div className="features-cta">
          <h3>Ready to discover your perfect career?</h3>
          <p>Join thousands of students who have found their ideal career path</p>
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary btn-large">
              Go to Dashboard
            </Link>
          ) : (
            <button 
              onClick={onSignupClick}
              className="btn btn-primary btn-large"
            > 
            Start Your Assessment Now
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;