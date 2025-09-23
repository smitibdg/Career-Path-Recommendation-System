import React, { useState, useEffect } from 'react';
import { useUser } from '../../../context/UserContext';
import './TestResults.css';

const TestResults = () => {
  const { 
    profile, 
    assessmentProgress, 
    getQuestionLevel, 
    getEducationLevel, 
    hasEducationLevel,
    getUserProfile 
  } = useUser();
  
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState('overview');

  useEffect(() => {
    const loadResults = async () => {
      setLoading(true);
      try {
        // Ensure we have latest profile data
        await getUserProfile(true);
        
        // Process assessment results
        const processedResults = processAssessmentResults();
        setResults(processedResults);
        
      } catch (error) {
        console.error('Error loading test results:', error);
      } finally {
        setLoading(false);
      }
    };

    if (profile) {
      loadResults();
    } else {
      setLoading(false);
    }
  }, [profile, assessmentProgress, getUserProfile]);

  const processAssessmentResults = () => {
    if (!profile || !assessmentProgress) return null;

    const testTypes = ['Personality', 'Skills', 'Cognitive', 'Situational', 'Values'];
    const completedTests = testTypes.filter(type => assessmentProgress[type]?.completed);
    const totalTests = testTypes.length;
    const completionRate = Math.round((completedTests.length / totalTests) * 100);

    // Calculate overall performance
    let totalScore = 0;
    let scoreCount = 0;
    const testDetails = {};

    testTypes.forEach(testType => {
      const test = assessmentProgress[testType];
      if (test?.completed && test?.score !== null && test?.score !== undefined) {
        totalScore += test.score;
        scoreCount++;
        
        testDetails[testType] = {
          completed: true,
          score: test.score,
          completedAt: test.completedAt,
          responses: test.responses || [],
          performance: getPerformanceLevel(test.score)
        };
      } else {
        testDetails[testType] = {
          completed: false,
          score: null,
          performance: null
        };
      }
    });

    const averageScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;

    return {
      profile: {
        educationLevel: profile.educationLevel,
        assessmentLevel: profile.assessmentLevel || getQuestionLevel(),
        name: profile.name
      },
      completion: {
        completed: completedTests.length,
        total: totalTests,
        rate: completionRate,
        completedTests
      },
      performance: {
        averageScore,
        totalResponses: scoreCount,
        overallLevel: getPerformanceLevel(averageScore)
      },
      testDetails
    };
  };

  const getPerformanceLevel = (score) => {
    if (score >= 85) return { level: 'Excellent', color: '#10b981', description: 'Outstanding performance' };
    if (score >= 70) return { level: 'Good', color: '#3b82f6', description: 'Above average performance' };
    if (score >= 55) return { level: 'Average', color: '#f59e0b', description: 'Satisfactory performance' };
    if (score >= 40) return { level: 'Below Average', color: '#ef4444', description: 'Room for improvement' };
    return { level: 'Needs Improvement', color: '#dc2626', description: 'Significant improvement needed' };
  };

  const getTestIcon = (testType) => {
    const icons = {
      'Personality': '🧠',
      'Skills': '⚡',
      'Cognitive': '🧮',
      'Situational': '🎯',
      'Values': '💎'
    };
    return icons[testType] || '📊';
  };

  const getRecommendations = () => {
    if (!results) return [];

    const recommendations = [];
    const { testDetails, performance } = results;

    // Education-level specific recommendations
    const assessmentLevel = results.profile.assessmentLevel;
    
    if (assessmentLevel === 'Foundation') {
      recommendations.push({
        type: 'education',
        title: 'Foundation Level Assessment Complete',
        description: 'Your results are based on foundation-level questions suitable for your current education level.',
        action: 'Consider advancing your education to unlock more detailed career insights.'
      });
    } else if (assessmentLevel === 'Intermediate') {
      recommendations.push({
        type: 'education',
        title: 'Intermediate Level Assessment',
        description: 'Your assessment reflects college-level understanding and capabilities.',
        action: 'Explore specialized courses and internship opportunities in your areas of strength.'
      });
    } else if (assessmentLevel === 'Advanced') {
      recommendations.push({
        type: 'education',
        title: 'Advanced Level Assessment',
        description: 'Your assessment demonstrates graduate-level analytical and professional capabilities.',
        action: 'Consider leadership roles, advanced certifications, or specialized career paths.'
      });
    }

    // Performance-based recommendations
    if (performance.averageScore >= 70) {
      recommendations.push({
        type: 'performance',
        title: 'Strong Overall Performance',
        description: 'You show excellent potential across multiple assessment areas.',
        action: 'Focus on leveraging your strengths in your chosen career path.'
      });
    } else if (performance.averageScore >= 50) {
      recommendations.push({
        type: 'performance',
        title: 'Balanced Performance Profile',
        description: 'You demonstrate solid capabilities with opportunities for growth.',
        action: 'Identify specific areas for skill development to enhance your career prospects.'
      });
    }

    // Test-specific recommendations
    Object.entries(testDetails).forEach(([testType, details]) => {
      if (details.completed && details.score < 50) {
        recommendations.push({
          type: 'improvement',
          title: `Improve ${testType} Skills`,
          description: `Your ${testType.toLowerCase()} assessment shows potential for growth.`,
          action: `Focus on developing ${testType.toLowerCase()} skills through targeted learning and practice.`
        });
      }
    });

    return recommendations;
  };

  if (loading) {
    return (
      <div className="test-results">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your test results...</p>
        </div>
      </div>
    );
  }

  if (!hasEducationLevel()) {
    return (
      <div className="test-results">
        <div className="no-profile-message">
          <div className="message-icon">⚠️</div>
          <h3>Profile Required</h3>
          <p>Please complete your profile to view personalized test results.</p>
          <p>Your education level determines the complexity of questions and result analysis.</p>
        </div>
      </div>
    );
  }

  if (!results || results.completion.completed === 0) {
    return (
      <div className="test-results">
        <div className="profile-level-header">
          <h2>📊 Test Results</h2>
          <div className="level-info">
            <span className="level-badge">{getQuestionLevel()}</span>
            <span className="level-detail">Assessment Level for {getEducationLevel()}</span>
          </div>
        </div>
        
        <div className="no-results-message">
          <div className="message-icon">📝</div>
          <h3>No Test Results Available</h3>
          <p>You haven't completed any assessments yet.</p>
          <p>Complete the {getQuestionLevel().toLowerCase()}-level assessments to see your personalized results and career recommendations.</p>
          <div className="assessment-info">
            <h4>Your Assessment Level: {getQuestionLevel()}</h4>
            <p>Based on your education level ({getEducationLevel()}), you'll receive {getQuestionLevel().toLowerCase()}-level questions.</p>
          </div>
        </div>
      </div>
    );
  }

  const recommendations = getRecommendations();

  return (
    <div className="test-results">
      {/* Header with Assessment Level */}
      <div className="results-header">
        <div className="header-content">
          <h2>📊 Your Test Results</h2>
          <div className="level-indicator">
            <span className={`assessment-level-badge ${getQuestionLevel().toLowerCase()}`}>
              {getQuestionLevel()} Level
            </span>
            <span className="level-description">
              Based on {getEducationLevel()} education level
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="results-navigation">
        <button 
          className={`nav-tab ${selectedTest === 'overview' ? 'active' : ''}`}
          onClick={() => setSelectedTest('overview')}
        >
          📈 Overview
        </button>
        {Object.keys(results.testDetails).map(testType => (
          <button
            key={testType}
            className={`nav-tab ${selectedTest === testType ? 'active' : ''} ${!results.testDetails[testType].completed ? 'disabled' : ''}`}
            onClick={() => results.testDetails[testType].completed && setSelectedTest(testType)}
            disabled={!results.testDetails[testType].completed}
          >
            {getTestIcon(testType)} {testType}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="results-content">
        {selectedTest === 'overview' ? (
          <div className="overview-section">
            {/* Completion Summary */}
            <div className="completion-card">
              <h3>🎯 Assessment Progress</h3>
              <div className="completion-stats">
                <div className="stat-item">
                  <span className="stat-number">{results.completion.completed}/{results.completion.total}</span>
                  <span className="stat-label">Tests Completed</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{results.completion.rate}%</span>
                  <span className="stat-label">Completion Rate</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number" style={{color: results.performance.overallLevel.color}}>
                    {results.performance.averageScore}%
                  </span>
                  <span className="stat-label">Average Score</span>
                </div>
              </div>
              <div className="completion-bar">
                <div 
                  className="completion-fill" 
                  style={{width: `${results.completion.rate}%`}}
                ></div>
              </div>
            </div>

            {/* Performance Overview */}
            {results.performance.totalResponses > 0 && (
              <div className="performance-card">
                <h3>🏆 Overall Performance</h3>
                <div className="performance-level">
                  <span 
                    className="level-indicator"
                    style={{color: results.performance.overallLevel.color}}
                  >
                    {results.performance.overallLevel.level}
                  </span>
                  <span className="level-desc">{results.performance.overallLevel.description}</span>
                </div>
              </div>
            )}

            {/* Test Summary Grid */}
            <div className="tests-grid">
              {Object.entries(results.testDetails).map(([testType, details]) => (
                <div 
                  key={testType} 
                  className={`test-summary-card ${!details.completed ? 'incomplete' : ''}`}
                  onClick={() => details.completed && setSelectedTest(testType)}
                >
                  <div className="card-header">
                    <span className="test-icon">{getTestIcon(testType)}</span>
                    <h4>{testType}</h4>
                    <span className={`status-badge ${details.completed ? 'completed' : 'pending'}`}>
                      {details.completed ? '✓ Completed' : 'Pending'}
                    </span>
                  </div>
                  {details.completed ? (
                    <div className="card-content">
                      <div className="score-display">
                        <span className="score-value" style={{color: details.performance.color}}>
                          {details.score}%
                        </span>
                        <span className="score-label">{details.performance.level}</span>
                      </div>
                      <div className="completion-date">
                        Completed: {new Date(details.completedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ) : (
                    <div className="card-content">
                      <p className="incomplete-message">Complete this assessment to see detailed results</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="recommendations-section">
                <h3>💡 Personalized Recommendations</h3>
                <div className="recommendations-list">
                  {recommendations.map((rec, index) => (
                    <div key={index} className={`recommendation-card ${rec.type}`}>
                      <h4>{rec.title}</h4>
                      <p className="rec-description">{rec.description}</p>
                      <p className="rec-action"><strong>Action:</strong> {rec.action}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          // Individual Test Results
          <div className="individual-test-section">
            {results.testDetails[selectedTest]?.completed ? (
              <div className="test-details">
                <div className="test-header">
                  <h3>{getTestIcon(selectedTest)} {selectedTest} Assessment Results</h3>
                  <div className="test-meta">
                    <span className="assessment-level">
                      {getQuestionLevel()} Level Questions
                    </span>
                    <span className="completion-date">
                      Completed: {new Date(results.testDetails[selectedTest].completedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="detailed-score-card">
                  <div className="score-circle">
                    <div className="score-value" style={{color: results.testDetails[selectedTest].performance.color}}>
                      {results.testDetails[selectedTest].score}%
                    </div>
                    <div className="score-label">{results.testDetails[selectedTest].performance.level}</div>
                  </div>
                  <div className="score-description">
                    <p>{results.testDetails[selectedTest].performance.description}</p>
                    <p className="response-count">
                      Based on {results.testDetails[selectedTest].responses.length} responses
                    </p>
                  </div>
                </div>

                {/* Test-specific insights would go here */}
                <div className="test-insights">
                  <h4>📈 Key Insights</h4>
                  <div className="insight-content">
                    <p>Your {selectedTest.toLowerCase()} assessment results indicate {results.testDetails[selectedTest].performance.level.toLowerCase()} performance in this area.</p>
                    
                    {getQuestionLevel() === 'Foundation' && (
                      <p><strong>Foundation Level Note:</strong> These results reflect your current capabilities at the foundation education level. As you advance your education, you'll have access to more detailed assessments.</p>
                    )}
                    
                    {getQuestionLevel() === 'Intermediate' && (
                      <p><strong>Intermediate Level Note:</strong> Your results show college-level understanding in {selectedTest.toLowerCase()}. Consider exploring related specializations.</p>
                    )}
                    
                    {getQuestionLevel() === 'Advanced' && (
                      <p><strong>Advanced Level Note:</strong> Your results demonstrate graduate-level competency in {selectedTest.toLowerCase()}. You're well-positioned for professional roles in this area.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="incomplete-test">
                <h3>{getTestIcon(selectedTest)} {selectedTest} Assessment</h3>
                <p>This assessment hasn't been completed yet.</p>
                <p>Complete the {selectedTest.toLowerCase()} assessment to see detailed results here.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestResults;