import React from 'react';
import { Link } from 'react-router-dom';
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
  
  // 🎯 FIXED: Extract data with multiple fallback paths for new backend format
  const user = testResults.user || {};
  const completedAt = testResults.completedAt;
  
  // Extract personality profile (single score from new backend format)
  const personalityProfile = testResults.personalityProfile || {};
  const personalityType = personalityProfile.type || 'Balanced Individual';
  const personalityScore = personalityProfile.score || 50;
  const personalityDescription = personalityProfile.description || 'Shows balanced traits across different personality dimensions';
  const dominantTrait = personalityProfile.dominantTrait || 'balanced';
  
  // Extract test results with fallback values
  const testData = testResults.testResults || {};
  
  // 🎯 Calculate REAL scores with multiple fallback strategies
  const calculateRealScores = (data, testType, totalQuestions) => {
    let correctAnswers = 0;
    let percentage = 0;
    
    console.log(`📊 Calculating scores for ${testType}:`, data);
    console.log(`📊 Available data keys:`, Object.keys(data));
    console.log(`📊 Data values:`, JSON.stringify(data, null, 2));
    
    // Strategy 1: Direct correct/score values
    if (data.correct !== undefined && data.correct >= 0) {
      console.log(`✅ Using Strategy 1 - Direct correct: ${data.correct}`);
      correctAnswers = data.correct;
      percentage = Math.round((correctAnswers / totalQuestions) * 100);
    } else if (data.score !== undefined && data.score >= 0) {
      console.log(`✅ Using Strategy 1 - Direct score: ${data.score}`);
      correctAnswers = data.score;
      percentage = Math.round((correctAnswers / totalQuestions) * 100);
    } 
    // Strategy 2: Use percentage if available
    else if (data.percentage !== undefined && data.percentage >= 0) {
      console.log(`✅ Using Strategy 2 - Percentage: ${data.percentage}`);
      percentage = data.percentage;
      correctAnswers = Math.round((percentage / 100) * totalQuestions);
    }
    // Strategy 3: Use total field
    else if (data.total !== undefined && data.total > 0) {
      console.log(`✅ Using Strategy 3 - Total questions: ${data.total}`);
      correctAnswers = data.correct || 0;
      percentage = Math.round((correctAnswers / data.total) * 100);
    }
    // Strategy 4: Use overall scores as fallback (0-1 scale)
    else if (testResults.overallScores && testResults.overallScores[testType.toLowerCase()]) {
      const overallScore = testResults.overallScores[testType.toLowerCase()];
      console.log(`✅ Using Strategy 4 - Overall score: ${overallScore}`);
      if (overallScore >= 0) {
        percentage = Math.round(overallScore * 100);
        correctAnswers = Math.round(overallScore * totalQuestions);
      }
    }
    // Strategy 5: REMOVE FALLBACK - Show real zeros!
    else {
      console.log(`❌ NO DATA FOUND - Using ZERO scores for ${testType}`);
      console.log(`❌ This means the backend is not sending proper data!`);
      percentage = 0;
      correctAnswers = 0;
    }
    
    console.log(`📊 ${testType} final scores:`, { correctAnswers, percentage, totalQuestions });
    return { correctAnswers, percentage, totalQuestions };
  };


  // Calculate scores for each test
  // ✅ CORRECT: Use dynamic totals from backend data
  const cognitiveScores = calculateRealScores(testData.cognitive || {}, 'cognitive', testData.cognitive?.total || 30);
  const skillsScores = calculateRealScores(testData.skills || {}, 'skills', testData.skills?.total || 38);
  const situationalScores = calculateRealScores(testData.situational || {}, 'situational', testData.situational?.total || 21);
  const valuesScores = calculateRealScores(testData.values || {}, 'values', testData.values?.total || 22);


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
        
        <Link 
          to="/dashboard/career-matches" 
          className="view-recommendations-btn"
          style={{
            display: 'inline-block',
            textDecoration: 'none',
            padding: '12px 24px',
            backgroundColor: '#10b981',
            color: 'white',
            borderRadius: '8px',
            fontWeight: '600',
            textAlign: 'center'
          }}
        >
          🔍 VIEW CAREER RECOMMENDATIONS
        </Link>
      </div>
    </div>
  );
};

export default TestResults;