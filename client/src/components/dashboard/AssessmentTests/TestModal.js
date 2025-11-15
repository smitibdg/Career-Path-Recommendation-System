import React, { useState, useEffect } from 'react';
import { assessmentQuestions } from '../../../data/questions';
import './TestModal.css';

const TestModal = ({ testType, testData, onComplete, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startTime] = useState(Date.now());

  // Get questions for the specific test type
  const questions = assessmentQuestions[testType] || [];

  useEffect(() => {
    // Set initial time (convert duration to minutes)
    const durationMinutes = testData?.duration ? 
      parseInt(testData.duration.split('-')[1] || testData.duration.split(' ')[0]) : 20;
    setTimeRemaining(durationMinutes * 60); // Convert to seconds

    // Prevent background scrolling
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [testData]);

  useEffect(() => {
    // Timer countdown
    if (timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleSubmit(); // Auto-submit when time runs out
    }
  }, [timeRemaining]);

  const handleAnswerSelect = (questionId, selectedOption) => {
    const currentQ = questions[currentQuestion];
    
    // Send the correct answer format based on question type
    let answerValue;
    
    // For personality questions (FP, IP, AP), send Likert scale numbers
    if (questionId.includes('P')) {
      answerValue = String(selectedOption + 1); // Convert 0,1,2,3,4 to "1","2","3","4","5"
    } else {
      // For Skills/Cognitive/Situational/Values, send option letters
      const optionMap = ['A', 'B', 'C', 'D', 'E'];
      answerValue = optionMap[selectedOption]; // Convert 0,1,2,3,4 to A,B,C,D,E
    }
    
    setAnswers({
      ...answers,
      [questionId]: {
        questionId,
        selectedOption,
        selectedAnswer: answerValue
      }
    });
  };


  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const timeTaken = Math.round((Date.now() - startTime) / 60000); // Convert to minutes
      
      // Prepare responses in the NEW format for backend
      const responses = Object.values(answers).map(answer => ({
        questionId: answer.questionId,
        answer: answer.selectedAnswer, // Use the text answer, not the option index
        testType: testType
      }));
      
      // Get user from auth context
      const user = JSON.parse(localStorage.getItem('user')) || {};
      
      // Submit to the ML API endpoint
      const response = await fetch('/api/ml/predict', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          testResponses: responses,
          action: 'submit',
          modelType: 'partial', // Don't run full career prediction for individual tests
          testType: testType,
          timeTaken: timeTaken
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Call the original onComplete with the new format
        onComplete(testType, {
          responses: responses,
          testType: testType,
          timeTaken: timeTaken,
          mlResults: data.data
        });
      } else {
        console.error('Failed to submit test:', data.message);
        alert('Error submitting test: ' + data.message);
      }
    } catch (error) {
      console.error('Error submitting test:', error);
      alert('Error submitting test. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isAnswered = answers[currentQ?.id];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const allQuestionsAnswered = Object.keys(answers).length === questions.length;

  if (!currentQ) {
    return (
      <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="error-message">
            <h3>⚠️ No questions available</h3>
            <p>Questions for {testType} test are not loaded.</p>
            <button onClick={onClose} className="close-btn">Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="test-info">
            <h2>{testData?.icon} {testData?.title}</h2>
            <div className="test-meta">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              {timeRemaining !== null && (
                <span className={`time-remaining ${timeRemaining < 300 ? 'warning' : ''}`}>
                  ⏱️ {formatTime(timeRemaining)}
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          <span className="progress-text">{Math.round(progress)}% Complete</span>
        </div>

        {/* Question Content */}
        <div className="question-container">
          <div className="question-number">
            Question {currentQuestion + 1}
          </div>
          
          <h3 className="question-text">{currentQ.question}</h3>

          <div className="options-container">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${isAnswered && isAnswered.selectedOption === index ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(currentQ.id, index)}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
                {isAnswered && isAnswered.selectedOption === index && (
                  <span className="selected-indicator">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Question Navigation */}
        <div className="question-navigation">
          <div className="nav-buttons">
            <button 
              onClick={handlePrevious} 
              disabled={currentQuestion === 0}
              className="nav-btn prev-btn"
            >
              ← Previous
            </button>

            {isLastQuestion ? (
              <button 
                onClick={handleSubmit}
                disabled={!allQuestionsAnswered || loading}
                className="nav-btn submit-btn"
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Test'
                )}
              </button>
            ) : (
              <button 
                onClick={handleNext}
                disabled={!isAnswered}
                className="nav-btn next-btn"
              >
                Next →
              </button>
            )}
          </div>

          {/* Question Indicators */}
          <div className="question-indicators">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`indicator 
                  ${index === currentQuestion ? 'current' : ''} 
                  ${answers[questions[index].id] ? 'answered' : ''}
                `}
                onClick={() => setCurrentQuestion(index)}
                title={`Question ${index + 1}`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Progress Summary */}
        <div className="progress-summary">
          <span>Answered: {Object.keys(answers).length}/{questions.length}</span>
          <span>Remaining: {questions.length - Object.keys(answers).length}</span>
        </div>
      </div>
    </div>
  );
};

export default TestModal;