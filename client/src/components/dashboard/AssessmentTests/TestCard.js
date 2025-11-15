import React, { useState, useEffect } from 'react';
import { useUser } from '../../../context/UserContext';
import TestResults from './TestResults';
import { getCurrentUserId } from '../../../utils/helpers';
import { getQuestionsByEducationLevel, getQuestionLevel } from '../../../data/questions';
import './TestCard.css';

const TestCards = () => {
  const { hasEducationLevel, hasProfile, currentEducationLevel, profile, profileLoaded } = useUser();

  const [completedTests, setCompletedTests] = useState(new Set());
  const [activeTest, setActiveTest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [allTestResponses, setAllTestResponses] = useState([]); // Store all test responses
  const [isSubmittingFinalAssessment, setIsSubmittingFinalAssessment] = useState(false);


  // Submit final assessment when all 5 tests are completed
  useEffect(() => {
    const submitFinalAssessment = async () => {
      if (completedTests.size === 5 && allTestResponses.length > 0 && !isSubmittingFinalAssessment && !showResults) {
        console.log('All tests completed! Submitting final assessment...');
        setIsSubmittingFinalAssessment(true);

        try {
          const userId = getCurrentUserId();
          if (!userId) {
            alert('Error: User not found. Please log in again.');
            return;
          }

          console.log('Submitting', allTestResponses.length, 'responses to backend');

          const response = await fetch('/api/ml/predict', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              userId: userId,
              testResponses: allTestResponses,
              action: 'submit',
              modelType: 'all'
            })
          });

          console.log('Final submission response status:', response.status);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log('FINAL SUBMISSION RESPONSE:', JSON.stringify(data, null, 2));

          let finalResults = null;
          if (data.success && data.data && data.data.detailedResults) {
            finalResults = data.data.detailedResults;
          } else if (data.success && data.data && data.data.user) {
            finalResults = data.data;
          } else if (data.success && data.detailedResults) {
            finalResults = data.detailedResults;
          }

          if (finalResults) {
            console.log('Final results received, displaying them');
            setTestResults(finalResults);
            setShowResults(true);
            
            // Scroll to results after a short delay
            setTimeout(() => {
              const element = document.getElementById('test-results-section');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }, 500);
          } else {
            console.error('No valid results structure found');
            alert('Error processing results. Please try again.');
          }

        } catch (error) {
          console.error('Error submitting final assessment:', error);
          alert('Error submitting assessment: ' + error.message);
        } finally {
          setIsSubmittingFinalAssessment(false);
        }
      }
    };

    submitFinalAssessment();
  }, [completedTests.size, allTestResponses.length, allTestResponses, isSubmittingFinalAssessment, showResults]); // ✅ Added allTestResponses


  useEffect(() => {
    const checkExistingResults = async () => {
      try {
        console.log('🔍 Checking for existing assessment results...');
        const userId = getCurrentUserId();
        
        if (!userId) {
          console.log('No user ID found');
          return;
        }

        const response = await fetch('/api/ml/check-assessment-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ userId })
        });

        const data = await response.json();
        console.log('Existing results check:', data);

        if (data.success && data.hasResults && data.results) {
          console.log('Found existing completed assessments!');
          console.log('Completed tests:', data.completedTests);
          
          // Set completed tests
          if (data.completedTests && Array.isArray(data.completedTests)) {
            const completedSet = new Set(data.completedTests);
            setCompletedTests(completedSet);
            console.log('Set completed tests:', Array.from(completedSet));
          }

          // Set test results
          setTestResults(data.results);
          setShowResults(true);
          
          console.log('Existing results loaded successfully');
        } else {
          console.log('No existing results found');
          // Make sure states are properly initialized for fresh start
          setCompletedTests(new Set());
          setShowResults(false);
          setTestResults(null);
        }
      } catch (error) {
        console.error('Error checking existing results:', error);
        // On error, assume fresh start
        setCompletedTests(new Set());
        setShowResults(false);
        setTestResults(null);
      }
    };

    // Only check for existing results when component mounts
    checkExistingResults();
  }, []); // Empty dependency array - only run on mount



  // Get user's education level and question level
  const userEducationLevel = currentEducationLevel || profile?.educationLevel || 'bachelors';
  const questionLevel = getQuestionLevel(userEducationLevel);

  // Declare showProfileWarning FIRST, then debug
  const showProfileWarning = profileLoaded && (!hasProfile() || !hasEducationLevel());

  // Add debug logging AFTER declaration
  console.log('Profile Debug Info:');
  console.log('profileLoaded:', profileLoaded);
  console.log('hasProfile():', hasProfile());
  console.log('hasEducationLevel():', hasEducationLevel());
  console.log('profile:', profile);
  console.log('currentEducationLevel:', currentEducationLevel);
  console.log('showProfileWarning:', showProfileWarning);


  const tests = [
    {
      id: 'Personality',
      title: 'Personality Assessment',
      description: 'Discover your personality traits and work preferences based on the Big Five model',
      icon: '🧠',
      duration: questionLevel === 'Foundation' ? '10-15 mins' : 
                questionLevel === 'Intermediate' ? '12-18 mins' : '15-20 mins',
      questions: 19,
      status: completedTests.has('Personality') ? 'completed' : 'not-started',
      color: '#6366f1',
      category: 'Personality'
    },
    {
      id: 'Skills',
      title: 'Skills Evaluation',
      description: 'Assess your technical and soft skills across various domains',
      icon: '⚡',
      duration: questionLevel === 'Foundation' ? '12-18 mins' : 
                questionLevel === 'Intermediate' ? '15-20 mins' : '18-25 mins',
      questions: 19,
      status: completedTests.has('Skills') ? 'completed' : 'not-started',
      color: '#8b5cf6',
      category: 'Skills'
    },
    {
      id: 'Cognitive',
      title: 'Cognitive Assessment',
      description: 'Test your logical reasoning, problem-solving, and mathematical abilities',
      icon: '🧮',
      duration: questionLevel === 'Foundation' ? '8-12 mins' : 
                questionLevel === 'Intermediate' ? '10-15 mins' : '12-18 mins',
      questions: 15,
      status: completedTests.has('Cognitive') ? 'completed' : 'not-started',
      color: '#06b6d4',
      category: 'Cognitive'
    },
    {
      id: 'Values',
      title: 'Values Assessment',
      description: 'Understand what matters most to you in work and life',
      icon: '💎',
      duration: questionLevel === 'Foundation' ? '6-10 mins' : 
                questionLevel === 'Intermediate' ? '7-12 mins' : '8-12 mins',
      questions: 11,
      status: completedTests.has('Values') ? 'completed' : 'not-started',
      color: '#10b981',
      category: 'Values'
    },
    {
      id: 'Situational',
      title: 'Situational Judgment',
      description: 'Evaluate decision-making skills in realistic scenarios',
      icon: '🎯',
      duration: questionLevel === 'Foundation' ? '7-12 mins' : 
                questionLevel === 'Intermediate' ? '8-15 mins' : '10-15 mins',
      questions: 11,
      status: completedTests.has('Situational') ? 'completed' : 'not-started',
      color: '#f59e0b',
      category: 'Situational'
    }
  ];

  const allTestsCompleted = completedTests.size === 5;

  const handleStartTest = (testId) => {
    setActiveTest(testId);
    setShowModal(true);
  };

  const handleTestComplete = (testResult) => {
    console.log('Test completed:', testResult.testType, 'Responses:', testResult.responses.length);
    
    // Add to completed tests
    setCompletedTests(prev => new Set([...prev, testResult.testType]));
    
    // Add responses to all test responses
    const formattedResponses = testResult.responses.map(response => ({
      questionId: response.questionId,
      answer: response.selectedOption + 1, // Convert 0-based to 1-based
      testType: testResult.testType
    }));
    
    setAllTestResponses(prev => [...prev, ...formattedResponses]);
    
    setShowModal(false);
    setActiveTest(null);
    
    console.log('📊 Total test responses collected:', allTestResponses.length + formattedResponses.length);
  };

  // Proper Retake Handler - Reset everything to start fresh
  const handleRetakeAssessment = async () => {
    console.log('🔄 Retaking assessment - resetting all states and clearing backend data');
    
    // Reset all local state
    setCompletedTests(new Set());
    setShowResults(false);  
    setTestResults(null);
    setAllTestResponses([]);
    setIsSubmittingFinalAssessment(false);
    
    // Clear backend data (you might want to keep history)
    try {
      const userId = getCurrentUserId();
      if (userId) {
        // await fetch('/api/assessments/clear', { method: 'DELETE', ... });
        console.log('Local state cleared, ready for fresh assessment');
      }
    } catch (error) {
      console.log('Error clearing backend data:', error.message);
    }
  };

  return (
    <div className="test-cards-container">
      {/* SECTION HEADER */}
      <div className="section-header">
        <h2>Career Assessment Tests</h2>
        <p>Complete all assessments to get personalized career recommendations tailored to your profile</p>
        
        {/* EDUCATION LEVEL BADGE */}
        <div style={{
          display: 'inline-block',
          backgroundColor: '#667eea',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '0.85rem',
          fontWeight: '600',
          marginTop: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {questionLevel} LEVEL - Based on {currentEducationLevel || profile?.educationLevel || 'Bachelors'}
        </div>
      </div>

      {/* PROGRESS OVERVIEW */}
      <div className="progress-overview">
        <div className="progress-stats">
          <div className="progress-stat">
            <span className="stat-number">{completedTests.size}/5</span>
            <span className="stat-label">TESTS COMPLETED</span>
          </div>
          <div className="progress-stat">
            <span className="stat-number">{Math.round((completedTests.size / 5) * 100)}%</span>
            <span className="stat-label">OVERALL PROGRESS</span>
          </div>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(completedTests.size / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* TEST CARDS GRID */}
      <div className="test-cards-grid">
        {tests.map((test) => (
          <div key={test.id} className="test-card">
            {/* Test Card Header */}
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
                  {test.status === 'completed' ? 'COMPLETED' : 'NOT STARTED'}
                </span>
              </div>
            </div>

            {/* Test Card Content */}
            <div className="test-content">
              <h3>{test.title}</h3>
              <p>{test.description}</p>

              {/* Test Details */}
              <div className="test-details">
                <div className="detail-item">
                  <span className="detail-icon">⏱</span>
                  <span>{test.duration}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📝</span>
                  <span>{test.questions} questions</span>
                </div>
              </div>
            </div>

            {/* Test Actions */}
            <div className="test-actions">
              <button
                className={`start-test-btn ${test.status === 'completed' ? 'completed' : ''}`}
                style={{ backgroundColor: test.color }}
                onClick={() => handleStartTest(test.id)}
                disabled={test.status === 'completed'}
              >
                {test.status === 'completed' ? (
                  <>✓ COMPLETED</>
                ) : (
                  <>START TEST <span className="btn-arrow">→</span></>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* COMPLETION MESSAGE */}
      {allTestsCompleted && !showResults && !isSubmittingFinalAssessment && (
        <div className="completion-message">
          <div className="message-icon">🎉</div>
          <h3>All Assessments Completed!</h3>
          <p>Congratulations! You've successfully completed all career assessment tests. We're now generating your personalized career recommendations and detailed analysis.</p>
        </div>
      )}

      {/* PROCESSING MESSAGE */}
      {isSubmittingFinalAssessment && (
        <div className="completion-message">
          <div className="message-icon">⏳</div>
          <h3>Processing Your Results...</h3>
          <p>Please wait while we analyze your responses and generate your personalized career recommendations.</p>
        </div>
      )}

      {/* RESULTS SECTION - With Fixed onRetake */}
      {showResults && testResults && (
        <div id="test-results-section" className="results-section">
          <TestResults 
            testResults={testResults}
            isEmbedded={true} 
            onRetake={handleRetakeAssessment}
          />
        </div>
      )}

      {/* TEST MODAL */}
      {showModal && activeTest && (
        <CompleteTestModal
          testType={activeTest}
          testData={tests.find(t => t.id === activeTest)}
          questions={getQuestionsByEducationLevel(userEducationLevel, activeTest)}
          onClose={() => {
            setShowModal(false);
            setActiveTest(null);
          }}
          onComplete={handleTestComplete}
        />
      )}
    </div>
  );
};

// Keep your existing CompleteTestModal component...
const CompleteTestModal = ({ testType, testData, questions, onClose, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [startTime] = useState(Date.now());

  // Safety checks
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return (
      <div className="test-modal modal-overlay">
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>⚠️ No questions available</h3>
            <button onClick={onClose} className="close-btn">✕</button>
          </div>
          <div className="question-container">
            <p>Questions for {testType} test are not loaded properly.</p>
            <div className="modal-navigation">
              <button onClick={onClose} className="next-btn">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const safeCurrentQuestion = Math.max(0, Math.min(currentQuestion, questions.length - 1));
  const currentQ = questions[safeCurrentQuestion];

  if (!currentQ || !currentQ.options || !Array.isArray(currentQ.options)) {
    return (
      <div className="test-modal modal-overlay">
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>⚠️ Question data error</h3>
            <button onClick={onClose} className="close-btn">✕</button>
          </div>
          <div className="question-container">
            <p>There's an issue with question {safeCurrentQuestion + 1} data.</p>
            <div className="modal-navigation">
              <button onClick={onClose} className="next-btn">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleAnswer = (questionId, answerIndex) => {
    if (!currentQ || !currentQ.options || answerIndex >= currentQ.options.length) return;
    
    setAnswers({ 
      ...answers, 
      [questionId]: {
        questionId,
        selectedOption: answerIndex,
        selectedAnswer: currentQ.options[answerIndex]
      }
    });
  };

  const handlePrevious = () => {
    if (safeCurrentQuestion > 0) {
      setCurrentQuestion(safeCurrentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (safeCurrentQuestion < questions.length - 1) {
      setCurrentQuestion(safeCurrentQuestion + 1);
    } else {
      handleSubmitTest();
    }
  };

  const handleSubmitTest = () => {
    const answeredCount = Object.keys(answers).length;
    const minRequired = Math.min(8, Math.ceil(questions.length * 0.4));

    if (answeredCount < minRequired) {
      alert(`Please answer at least ${minRequired} questions before submitting the test. You have answered ${answeredCount} questions.`);
      return;
    }

    const timeTaken = Math.round((Date.now() - startTime) / 60000);
    const results = {
      testType,
      responses: Object.values(answers),
      timeTaken,
      completionDate: new Date().toISOString(),
      totalQuestions: questions.length,
      answeredQuestions: answeredCount
    };
    
    onComplete(results);
  };

  const handleJumpToQuestion = (questionIndex) => {
    if (questionIndex >= 0 && questionIndex < questions.length) {
      setCurrentQuestion(questionIndex);
    }
  };

  const progressPercentage = ((safeCurrentQuestion + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount >= Math.ceil(questions.length * 0.4);

  return (
    <div className="test-modal modal-overlay">
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h3>{testData?.title || testType} Test</h3>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-container">
          <div className="progress-bar-modal">
            <div 
              className="progress-fill-modal"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="progress-text-modal">
            Question {safeCurrentQuestion + 1} of {questions.length}
          </div>
        </div>

        {/* Question Container */}
        <div className="question-container">
          {/* Question Header */}
          <div className="question-header">
            <span className="question-number">
              Question {safeCurrentQuestion + 1}
            </span>
            <div className="header-right">
              <span className="question-category">{testType}</span>
            </div>
          </div>

          {/* Question Text */}
          <h3 className="question-text">{currentQ.question}</h3>

          {/* Options */}
          <div className="options-list">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${answers[currentQ.id]?.selectedOption === index ? 'selected' : ''}`}
                onClick={() => handleAnswer(currentQ.id, index)}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="option-text">{option}</span>
                {answers[currentQ.id]?.selectedOption === index && (
                  <span className="check-mark">✓</span>
                )}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="modal-navigation">
            <button 
              className="prev-btn"
              onClick={handlePrevious}
              disabled={safeCurrentQuestion === 0}
            >
              ← Previous
            </button>

            <div className="question-indicators">
              {questions.slice(0, 15).map((_, index) => (
                <div
                  key={index}
                  className={`indicator ${index === safeCurrentQuestion ? 'current' : ''} ${answers[questions[index]?.id] ? 'answered' : ''}`}
                  onClick={() => handleJumpToQuestion(index)}
                >
                  {index + 1}
                </div>
              ))}
            </div>

            <button 
              className="next-btn"
              onClick={handleNext}
            >
              {safeCurrentQuestion === questions.length - 1 ? 'Submit Test' : 'Next →'}
            </button>
          </div>

          {/* Answer Status */}
          <div className="answer-status">
            <span>Answered: {answeredCount}/{questions.length}</span>
            <button 
              className={`ready-submit-btn ${allAnswered ? 'ready' : 'pending'}`}
              onClick={allAnswered ? handleSubmitTest : undefined}
              disabled={!allAnswered}
            >
              {allAnswered ? '✓ READY TO SUBMIT' : `Need ${Math.ceil(questions.length * 0.4) - answeredCount} more`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCards;