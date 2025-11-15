import React from 'react';
import './TestResults.css';

const TestResults = ({ testResults, isEmbedded, onRetake }) => {
  console.log('🖥️ TestResults component received:', testResults);
  console.log('🖥️ TestResults.testResults:', testResults?.testResults);
  console.log('🖥️ TestResults.testResults.cognitive:', testResults?.testResults?.cognitive);
  console.log('🖥️ TestResults.testResults.skills:', testResults?.testResults?.skills);
  console.log('🖥️ TestResults.overallScores:', testResults?.overallScores);
  console.log('🖥️ TestResults exists:', !!testResults);

  if (!testResults) {
    console.log('🖥️ TestResults is null/undefined - showing loading');
    return (
      <div className="test-results-loading">
        <p>Loading results...</p>
      </div>
    );
  }
  
  console.log('🖥️ TestResults data structure:', JSON.stringify(testResults, null, 2));
  
  // Extract data with multiple fallback paths for new backend format
  const user = testResults.user || {};
  const completedAt = testResults.completedAt;
  
  // Extract personality profile (single score from new backend format)
  const personalityProfile = testResults.personalityProfile || {};
  const personalityType = personalityProfile.type || 'Balanced Individual';
  const personalityScore = personalityProfile.score || 50;
  const personalityDescription = personalityProfile.description || 'Shows balanced traits across different personality dimensions';
  const dominantTrait = personalityProfile.dominantTrait || 'balanced';
  
  // Extract test results with fallback valuesfrom the correct path
  const testData = testResults.detailed_scores || testResults.testResults || {};
  console.log('🖥️ Using testData from detailed_scores:', testData);

  
  // Calculate REAL scores with multiple fallback strategies
  const calculateRealScores = (data, testType) => {
    let correctAnswers = 0;
    let percentage = 0;
    let totalQuestions = 0;
    
    console.log(`📊 Calculating scores for ${testType}:`, data);
    
    // Strategy 1: Use backend detailed_scores data (correct + total + percentage)
    if (data.correct !== undefined && data.total !== undefined) {
      console.log(`✅ Using backend detailed_scores - correct: ${data.correct}, total: ${data.total}`);
      correctAnswers = data.correct;
      totalQuestions = data.total; // ← Use backend's total (attempted questions)
      percentage = data.percentage || Math.round((correctAnswers / totalQuestions) * 100);
    } 
    // Strategy 2: Use percentage if available but no totals
    else if (data.percentage !== undefined && data.percentage >= 0) {
      console.log(`✅ Using percentage: ${data.percentage}`);
      percentage = data.percentage;
      correctAnswers = 0; // Can't calculate without total
      totalQuestions = 0;
    }
    // Strategy 3: Use overall scores as fallback (0-1 scale)
    else if (testResults.overallScores && testResults.overallScores[testType.toLowerCase()]) {
      const overallScore = testResults.overallScores[testType.toLowerCase()];
      console.log(`✅ Using overall score: ${overallScore}`);
      if (overallScore >= 0) {
        percentage = Math.round(overallScore * 100);
        correctAnswers = 0;
        totalQuestions = 0;
      }
    }
    // Strategy 4: No data found
    else {
      console.log(`NO DATA FOUND - Using ZERO scores for ${testType}`);
      percentage = 0;
      correctAnswers = 0;
      totalQuestions = 0;
    }
    
    console.log(`📊 ${testType} final scores:`, { correctAnswers, percentage, totalQuestions });
    return { correctAnswers, percentage, totalQuestions };
  };



  // Let the function use backend totals automatically
  const cognitiveScores = calculateRealScores(testData.cognitive || {}, 'cognitive');
  const skillsScores = calculateRealScores(testData.skills || {}, 'skills'); 
  const situationalScores = calculateRealScores(testData.situational || {}, 'situational');
  const valuesScores = calculateRealScores(testData.values || {}, 'values');



  // Format completion date
  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  return (
    <div className="test-results-container" id="test-results-section">
      {/* Header Section */}
      <div className="test-results-header">
        <h2>🧠 Your Assessment Results</h2>
        <p className="completion-date">Completed on: {formatDate(completedAt)}</p>
        
        <p className="education-info">
          Education Level: 
          <span className="education-badge">{user.educationLevel || 'INTERMEDIATE'}</span>
        </p>
      </div>

      {/* 🎯 PERSONALITY PROFILE SECTION - ALWAYS SHOW */}
      <div className="personality-section">
        <h3>🧠 Personality Profile (Big 5)</h3>
        <div className="personality-display">
          <div className="personality-card">
            <div className="personality-header">
              <h4>{personalityType}</h4>
              <div className="personality-score-circle">
                <span className="score-number">{personalityScore}</span>
                <span className="score-label">Score</span>
              </div>
            </div>
            <div className="personality-description">
              <p>{personalityDescription}</p>
              <p className="dominant-trait">
                <strong>Dominant Trait:</strong> {dominantTrait}
              </p>
            </div>
            <div className="personality-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill personality-fill"
                  style={{ width: `${personalityScore}%` }}
                ></div>
              </div>
              <span className="progress-percentage">{personalityScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Test Performance Section */}
      <div className="performance-section">
        <h3>📊 Test Performance</h3>
        <div className="performance-grid">
          
          {/* Cognitive Abilities */}
          <div className="performance-card cognitive-card">
            <h4>🧠 Cognitive Abilities</h4>
            <div className="score-display">
              <span className="score-fraction">
                {cognitiveScores.correctAnswers}/{cognitiveScores.totalQuestions}
              </span>
              <span className="score-percentage">
                {cognitiveScores.percentage}%
              </span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill cognitive-fill"
                style={{ width: `${cognitiveScores.percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Skills Assessment */}
          <div className="performance-card skills-card">
            <h4>⚡ Skills Assessment</h4>
            <div className="score-display">
              <span className="score-fraction">
                {skillsScores.correctAnswers}/{skillsScores.totalQuestions}
              </span>
              <span className="score-percentage">
                {skillsScores.percentage}%
              </span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill skills-fill"
                style={{ width: `${skillsScores.percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Situational Judgment */}
          <div className="performance-card situational-card">
            <h4>🎯 Situational Judgment</h4>
            <div className="score-display">
              <span className="score-fraction">
                {situationalScores.correctAnswers}/{situationalScores.totalQuestions}
              </span>
              <span className="score-percentage">
                {situationalScores.percentage}%
              </span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill situational-fill"
                style={{ width: `${situationalScores.percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Values Assessment */}
          <div className="performance-card values-card">
            <h4>💎 Values Assessment</h4>
            <div className="score-display">
              <span className="score-fraction">
                {valuesScores.correctAnswers}/{valuesScores.totalQuestions}
              </span>
              <span className="score-percentage">
                {valuesScores.percentage}%
              </span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill values-fill"
                style={{ width: `${valuesScores.percentage}%` }}
              ></div>
            </div>
          </div>

        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button 
          className="action-btn retake-btn"
          onClick={onRetake || (() => window.location.reload())}
          style={{
            padding: '12px 24px',
            backgroundColor: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            marginRight: '12px'
          }}
        >
          🔄 RETAKE ASSESSMENT
        </button>
        
        <button 
          className="view-recommendations-btn" 
          onClick={() => {
            // Navigate to career matches section
            if (window.location.pathname.includes('dashboard')) {
              // If we're on dashboard, trigger career matches section
              const event = new CustomEvent('navigateToCareerMatches');
              window.dispatchEvent(event);
            } else {
              // If not on dashboard, navigate to dashboard with career matches
              window.location.href = '/dashboard#career-matches';
            }
          }}
          style={{
            display: 'inline-block',
            textDecoration: 'none',
            padding: '12px 24px',
            backgroundColor: '#10b981',
            color: 'white',
            borderRadius: '8px',
            fontWeight: '600',
            textAlign: 'center',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          VIEW CAREER RECOMMENDATIONS
        </button>
      </div>
    </div>
  );
};

export default TestResults;