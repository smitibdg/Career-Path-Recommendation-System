import React, { useState } from 'react';
import './TestCard.css';

const TestCards = () => {
  const [completedTests, setCompletedTests] = useState(0);
  
  const tests = [
    {
      id: 1,
      title: 'Personality Assessment',
      description: 'Discover your personality traits and work preferences based on the Big Five model',
      icon: '🧠',
      duration: '15 mins',
      questions: 50,
      status: 'not-started',
      color: '#6366f1',
      category: 'Personality'
    },
    {
      id: 2,
      title: 'Skills Evaluation',
      description: 'Assess your technical and soft skills across various domains',
      icon: '⚡',
      duration: '20 mins',
      questions: 40,
      status: 'not-started',
      color: '#8b5cf6',
      category: 'Skills'
    },
    {
      id: 3,
      title: 'Interest Inventory',
      description: 'Identify your career interests and passions using Holland Code theory',
      icon: '❤️',
      duration: '12 mins',
      questions: 35,
      status: 'not-started',
      color: '#06b6d4',
      category: 'Interests'
    },
    {
      id: 4,
      title: 'Values Assessment',
      description: 'Understand what matters most to you in work and life',
      icon: '⭐',
      duration: '10 mins',
      questions: 25,
      status: 'not-started',
      color: '#10b981',
      category: 'Values'
    },
    {
      id: 5,
      title: 'Situational Judgment',
      description: 'Evaluate decision-making skills in realistic work scenarios',
      icon: '🎯',
      duration: '18 mins',
      questions: 30,
      status: 'not-started',
      color: '#f59e0b',
      category: 'Judgment'
    }
  ];

  const handleStartTest = (testId) => {
    console.log(`Starting test ${testId}`);
    // TODO: Navigate to test page
    alert(`Test ${testId} will be available soon!`);
  };

  const totalTests = tests.length;
  const progressPercentage = (completedTests / totalTests) * 100;

  return (
    <div className="test-cards-container">
      <div className="section-header">
        <h2>Career Assessment Tests</h2>
        <p>Complete all assessments to get personalized career recommendations tailored to your profile</p>
      </div>

      <div className="progress-overview">
        <div className="progress-stats">
          <div className="progress-stat">
            <span className="stat-number">{completedTests}/{totalTests}</span>
            <span className="stat-label">Tests Completed</span>
          </div>
          <div className="progress-stat">
            <span className="stat-number">{Math.round(progressPercentage)}%</span>
            <span className="stat-label">Overall Progress</span>
          </div>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="test-cards-grid">
        {tests.map((test) => (
          <div key={test.id} className="test-card">
            <div className="test-card-header">
              <div 
                className="test-icon" 
                style={{ backgroundColor: test.color }}
              >
                {test.icon}
              </div>
              <div className="test-meta">
                <span className="test-category">{test.category}</span>
                <span className={`status-badge ${test.status}`}>
                  {test.status === 'not-started' ? 'Not Started' : 
                   test.status === 'in-progress' ? 'In Progress' : 'Completed'}
                </span>
              </div>
            </div>

            <div className="test-content">
              <h3>{test.title}</h3>
              <p>{test.description}</p>
              
              <div className="test-details">
                <div className="detail-item">
                  <span className="detail-icon">⏱️</span>
                  <span>{test.duration}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📝</span>
                  <span>{test.questions} questions</span>
                </div>
              </div>
            </div>

            <div className="test-actions">
              <button 
                className="start-test-btn"
                onClick={() => handleStartTest(test.id)}
                style={{ backgroundColor: test.color }}
              >
                <span>Start Assessment</span>
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="completion-message">
        <div className="message-icon">🎓</div>
        <h3>Ready to discover your perfect career?</h3>
        <p>Complete all assessments above to unlock personalized career recommendations, detailed analysis, and curated learning paths.</p>
      </div>
    </div>
  );
};

export default TestCards;