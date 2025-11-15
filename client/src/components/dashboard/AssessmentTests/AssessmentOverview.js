import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import TestCard from './TestCard';
import TestModal from './TestModal';
import TestResults from './TestResults';
import CareerMatches from './CareerMatches';
import { testMetadata } from '../../../data/questions';
import './AssessmentOverview.css';

const AssessmentOverview = () => {
  const { user } = useAuth();
  const [assessmentTypes, setAssessmentTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTest, setActiveTest] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showCareerMatches, setShowCareerMatches] = useState(false);

  // Assessment progress persistence
  const [completedTests, setCompletedTests] = useState(() => {
    try {
      const saved = localStorage.getItem('assessmentProgress');
      const parsed = saved ? JSON.parse(saved) : { completedTests: [] };
      return parsed.completedTests || [];
    } catch (error) {
      console.error('Error loading assessment progress:', error);
      return [];
    }
  });

  const [assessmentState, setAssessmentState] = useState({
    isCompleted: false,
    hasResults: false,
    completedTests: [],
    results: null
  })


  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

  const checkUserAssessmentStatus = async () => {
    try {
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        console.log('No userId found in localStorage');
        return;
      }

      
      const response = await fetch(`${API_BASE_URL}/ml/check-assessment-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      
      const data = await response.json();
      
      if (data.hasResults) {
        setAssessmentState({
          isCompleted: true,
          hasResults: true,
          completedTests: data.completedTests,
          results: data.results
        });
        
        localStorage.setItem('assessmentState', JSON.stringify({
          isCompleted: true,
          hasResults: true,
          completedTests: data.completedTests,
          results: data.results
        }));
        
      }
    } catch (error) {
      console.error('Error checking assessment status:', error);
    }
  };


  const handleRetakeAssessment = () => {
    setAssessmentState({
      isCompleted: false,
      hasResults: false,
      completedTests: [],
      results: null
    })
    
    localStorage.removeItem('assessmentState')
    setShowResults(false)
    loadAssessmentTypes()
  }

  const handleAssessmentComplete = (results) => {
    const newState = {
      isCompleted: true,
      hasResults: true,
      completedTests: ['personality', 'cognitive', 'skills', 'situational', 'values'],
      results: results
    }
    
    setAssessmentState(newState)
    localStorage.setItem('assessmentState', JSON.stringify(newState))
    setShowResults(true)
  }


  useEffect(() => {
    loadAssessmentTypes();
  }, []);

  useEffect(() => {
    checkUserAssessmentStatus()
  }, [])

  const loadAssessmentTypes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${API_BASE_URL}/assessments/types`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setAssessmentTypes(data.assessmentTypes);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error loading assessment types:', error);
      setError('Failed to load assessments');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = (testType) => {
    setActiveTest(testType);
  };

  const handleTestComplete = (testType) => {
    setActiveTest(null);
    
    // Mark test as completed and persist
    const updatedCompleted = completedTests.includes(testType) 
      ? completedTests 
      : [...completedTests, testType];
    
    setCompletedTests(updatedCompleted);
    
    // Save to localStorage
    const progressData = {
      completedTests: updatedCompleted,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('assessmentProgress', JSON.stringify(progressData));
    
    loadAssessmentTypes(); // Refresh to show completed status
  };


  const handleCloseTest = () => {
    setActiveTest(null);
  };

  const handleViewResults = () => {
    setShowResults(true);
  };

  const handleViewCareerMatches = () => {
    setShowCareerMatches(true);
  };

  const handleBackToOverview = () => {
    setShowResults(false);
    setShowCareerMatches(false);
  };


  if (loading) {
    return (
      <div className="assessment-loading">
        <div className="loading-spinner"></div>
        <p>Loading assessments...</p>
      </div>
    );
  }

  if (showResults) {
    return <TestResults onBack={handleBackToOverview} />;
  }

  if (showCareerMatches) {
    return <CareerMatches onBack={handleBackToOverview} />;
  }

  const completedCount = assessmentTypes.filter(a => a.completed).length;
  const totalCount = assessmentTypes.length;

  return (
    <div className="assessment-overview">
      <div className="assessment-header">
        <h2>🎯 Career Assessment Tests</h2>
        <p>Complete comprehensive assessments to discover your ideal career path</p>
        
        <div className="progress-summary">
          <div className="progress-stat">
            <span className="stat-number">{completedCount}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="progress-stat">
            <span className="stat-number">{totalCount - completedCount}</span>
            <span className="stat-label">Remaining</span>
          </div>
          <div className="progress-stat">
            <span className="stat-number">{totalCount}</span>
            <span className="stat-label">Total Tests</span>
          </div>
        </div>

        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          ></div>
          <span className="progress-text">
            {Math.round((completedCount / totalCount) * 100)}% Complete
          </span>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
        </div>
      )}

      <div className="assessment-actions">
        <button 
          className="action-btn results-btn"
          onClick={handleViewResults}
          disabled={completedCount === 0}
        >
          📊 View My Results
        </button>
        <button 
          className="action-btn career-btn"
          onClick={handleViewCareerMatches}
          disabled={completedCount < 3}
        >
          🎯 Get Career Matches
        </button>
        {/* Retake button */}
        <button 
          className="action-btn retake-btn"
          onClick={handleRetakeAssessment}
          disabled={completedCount === 0}
        >
          🔄 Retake All Tests
        </button>
      </div>


      <div className="assessment-grid">
        {assessmentTypes.map((assessment) => (
          <TestCard
            key={assessment.id}
            assessment={assessment}
            onStartTest={() => handleStartTest(assessment.id)}
          />
        ))}
      </div>

      {completedCount > 0 && (
        <div className="completion-message">
          <h3>🎉 Great Progress!</h3>
          <p>
            You've completed {completedCount} out of {totalCount} assessments. 
            {completedCount >= 3 
              ? " You can now get personalized career recommendations!" 
              : ` Complete ${3 - completedCount} more to unlock career matches.`
            }
          </p>
        </div>
      )}

      {/* Test Modal */}
      {activeTest && (
        <TestModal
          testType={activeTest}
          testData={testMetadata[activeTest]}
          onComplete={() => handleTestComplete(activeTest)}
          onClose={handleCloseTest}
        />
      )}

    </div>
  );
};

export default AssessmentOverview;