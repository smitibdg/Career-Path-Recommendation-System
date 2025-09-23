import React, { useState, useEffect } from 'react';
import './TestCard.css';

const TestCards = () => {
  // Use Set to track unique completed tests (prevents duplicates)
  const [completedTests, setCompletedTests] = useState(new Set());
  const [activeTest, setActiveTest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (showModal) {
      // Disable background scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px'; // Prevent layout shift
    } else {
      // Re-enable background scrolling
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [showModal]);


  const tests = [
    {
      id: 'Personality',
      title: 'Personality Assessment',
      description: 'Discover your personality traits and work preferences based on the Big Five model',
      icon: '🧠',
      duration: '15-20 mins',
      questions: 25,
      status: 'not-started',
      color: '#6366f1',
      category: 'Personality'
    },
    {
      id: 'Skills',
      title: 'Skills Evaluation',
      description: 'Assess your technical and soft skills across various domains',
      icon: '⚡',
      duration: '20-25 mins',
      questions: 25,
      status: 'not-started',
      color: '#8b5cf6',
      category: 'Skills'
    },
    {
      id: 'Cognitive',
      title: 'Cognitive Assessment',
      description: 'Test your logical reasoning, problem-solving, and mathematical abilities',
      icon: '🧮',
      duration: '20-25 mins',
      questions: 20,
      status: 'not-started',
      color: '#06b6d4',
      category: 'Cognitive'
    },
    {
      id: 'Values',
      title: 'Values Assessment',
      description: 'Understand what matters most to you in work and life',
      icon: '💎',
      duration: '10-15 mins',
      questions: 15,
      status: 'not-started',
      color: '#10b981',
      category: 'Values'
    },
    {
      id: 'Situational',
      title: 'Situational Judgment',
      description: 'Evaluate decision-making skills in realistic work scenarios',
      icon: '🎯',
      duration: '15-20 mins',
      questions: 15,
      status: 'not-started',
      color: '#f59e0b',
      category: 'Situational'
    }
  ];

  // Complete question bank - all 100 questions included
  const assessmentQuestions = {
    Personality: [
      {
        id: 'P001',
        question: 'I enjoy meeting new people and making conversation',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 'P002',
        question: 'I prefer working alone rather than in groups',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 'P003',
        question: 'I feel energized after spending time with others',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 'P004',
        question: 'I often take charge in group situations',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 'P005',
        question: 'I enjoy being the center of attention',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 'P006',
        question: 'I am always prepared and organized',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 'P007',
        question: 'I pay attention to details',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 'P008',
        question: 'I get chores done right away',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 'P009',
        question: 'I follow a schedule',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 'P010',
        question: 'I am exacting in my work',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 'P011',
        question: 'I enjoy exploring new ideas and concepts',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 'P012',
        question: 'I am quick to understand things',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 'P013',
        question: 'I use difficult words',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 'P014',
        question: 'I am full of ideas',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 'P015',
        question: 'I handle tasks efficiently',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 'P016',
        question: 'I try to be helpful and considerate to others',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 'P017',
        question: 'I have a soft heart',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 'P018',
        question: 'I take time out for others',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 'P019',
        question: 'I feel others\' emotions',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 'P020',
        question: 'I make people feel at ease',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 'P021',
        question: 'I often feel anxious or worried',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 'P022',
        question: 'I get irritated easily',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 'P023',
        question: 'I get stressed out easily',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 'P024',
        question: 'I worry about things',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 'P025',
        question: 'I get upset easily',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      }
    ],

    Cognitive: [
      {
        id: 'C001',
        question: 'What comes next in the sequence: 2, 6, 18, 54, ?',
        options: ['108', '162', '216', '324']
      },
      {
        id: 'C002',
        question: 'If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?',
        options: ['1 minute', '5 minutes', '20 minutes', '100 minutes']
      },
      {
        id: 'C003',
        question: 'A bat and ball cost ₹110 in total. The bat costs ₹100 more than the ball. How much does the ball cost?',
        options: ['₹5', '₹10', '₹15', '₹55']
      },
      {
        id: 'C004',
        question: 'What is the missing number: 3, 7, 13, 21, 31, ?',
        options: ['43', '45', '47', '49']
      },
      {
        id: 'C005',
        question: 'If all roses are flowers and some flowers are red, which statement is necessarily true?',
        options: ['All roses are red', 'Some roses are red', 'No roses are red', 'Some flowers are roses']
      },
      {
        id: 'C006',
        question: 'Which number is different from the others: 121, 144, 169, 196, 225?',
        options: ['121', '144', '169', '196']
      },
      {
        id: 'C007',
        question: 'Complete the analogy: Book is to Reading as Fork is to ?',
        options: ['Writing', 'Eating', 'Cooking', 'Kitchen']
      },
      {
        id: 'C008',
        question: 'What is 15% of 240?',
        options: ['30', '36', '40', '45']
      },
      {
        id: 'C009',
        question: 'Which comes next in the pattern: A1, B4, C9, D16, ?',
        options: ['E20', 'E25', 'F25', 'E24']
      },
      {
        id: 'C010',
        question: 'If you rearrange the letters \'CIFAIPC\' you would get the name of a:',
        options: ['Ocean', 'Country', 'City', 'River']
      },
      {
        id: 'C011',
        question: 'What is the next number: 1, 4, 9, 16, 25, ?',
        options: ['30', '35', '36', '49']
      },
      {
        id: 'C012',
        question: 'Mary is 16. She is 4 times older than her brother. How old will Mary be when she is twice as old as her brother?',
        options: ['20', '24', '28', '32']
      },
      {
        id: 'C013',
        question: 'Which word does not belong: Dog, Cat, Bird, Car?',
        options: ['Dog', 'Cat', 'Bird', 'Car']
      },
      {
        id: 'C014',
        question: 'If 2 + 3 = 10, 6 + 5 = 66, 8 + 4 = 96, then 7 + 2 = ?',
        options: ['63', '72', '81', '90']
      },
      {
        id: 'C015',
        question: 'What comes next: Monday, Wednesday, Friday, ?',
        options: ['Saturday', 'Sunday', 'Tuesday', 'Thursday']
      },
      {
        id: 'C016',
        question: 'Complete: Fire is to Heat as Ice is to ?',
        options: ['Water', 'Winter', 'Cold', 'Frozen']
      },
      {
        id: 'C017',
        question: 'Which number should replace the question mark: 2, 6, 12, 20, 30, ?',
        options: ['40', '42', '44', '48']
      },
      {
        id: 'C018',
        question: 'If all birds can fly and penguins are birds, what can we conclude?',
        options: ['Penguins can fly', 'Some birds cannot fly', 'The premise is false', 'All of the above']
      },
      {
        id: 'C019',
        question: 'What is the odd one out: 8, 27, 64, 125, 216?',
        options: ['8', '27', '64', '125']
      },
      {
        id: 'C020',
        question: 'Complete the series: Z, Y, X, W, V, ?',
        options: ['U', 'T', 'S', 'R']
      }
    ],

    Skills: [
      {
        id: 'S001',
        question: 'What does HTML stand for?',
        options: ['HyperText Markup Language', 'Home Tool Markup Language', 'Hyperlinks Text Mark Language', 'None of the above']
      },
      {
        id: 'S002',
        question: 'Which programming language is known as the \'language of the web\'?',
        options: ['Python', 'JavaScript', 'Java', 'C++']
      },
      {
        id: 'S003',
        question: 'What does SQL stand for?',
        options: ['Structured Query Language', 'Simple Question Language', 'Standard Query Logic', 'System Query Language']
      },
      {
        id: 'S004',
        question: 'Which of the following is a NoSQL database?',
        options: ['MySQL', 'PostgreSQL', 'MongoDB', 'Oracle']
      },
      {
        id: 'S005',
        question: 'What is the time complexity of binary search?',
        options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)']
      },
      {
        id: 'S006',
        question: 'Which HTTP method is used to update data?',
        options: ['GET', 'POST', 'PUT', 'DELETE']
      },
      {
        id: 'S007',
        question: 'What does API stand for?',
        options: ['Application Programming Interface', 'Automated Program Instruction', 'Advanced Programming Integration', 'None of the above']
      },
      {
        id: 'S008',
        question: 'Which is NOT a principle of Object-Oriented Programming?',
        options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Compilation']
      },
      {
        id: 'S009',
        question: 'What is the correct way to declare a variable in Python?',
        options: ['var x = 5', 'int x = 5', 'x = 5', 'declare x = 5']
      },
      {
        id: 'S010',
        question: 'Which data structure follows LIFO principle?',
        options: ['Queue', 'Stack', 'Array', 'Tree']
      },
      {
        id: 'S011',
        question: 'What is the most important element of effective communication?',
        options: ['Speaking loudly', 'Using complex words', 'Active listening', 'Fast talking']
      },
      {
        id: 'S012',
        question: 'Which is the best way to handle workplace conflict?',
        options: ['Avoid the person', 'Discuss the issue directly', 'Complain to others', 'Ignore the problem']
      },
      {
        id: 'S013',
        question: 'What does \'emotional intelligence\' primarily involve?',
        options: ['High IQ', 'Managing emotions', 'Technical skills', 'Memory']
      },
      {
        id: 'S014',
        question: 'Which is most important in teamwork?',
        options: ['Individual brilliance', 'Clear communication', 'Competition', 'Independence']
      },
      {
        id: 'S015',
        question: 'What does ROI stand for in business?',
        options: ['Return on Investment', 'Rate of Interest', 'Range of Income', 'Risk of Investment']
      },
      {
        id: 'S016',
        question: 'Which is a key component of project management?',
        options: ['Only technical skills', 'Planning and execution', 'Working alone', 'Avoiding deadlines']
      },
      {
        id: 'S017',
        question: 'What is market research primarily used for?',
        options: ['Increasing costs', 'Understanding customer needs', 'Reducing employees', 'Eliminating competition']
      },
      {
        id: 'S018',
        question: 'In Excel, what function calculates the average?',
        options: ['SUM', 'AVERAGE', 'MEAN', 'CALC']
      },
      {
        id: 'S019',
        question: 'Which is a version control system?',
        options: ['Microsoft Word', 'Git', 'Photoshop', 'Excel']
      },
      {
        id: 'S020',
        question: 'What does UX stand for in design?',
        options: ['User Experience', 'User Extension', 'Universal Exchange', 'Unified Extension']
      },
      {
        id: 'S021',
        question: 'Which is most important in problem-solving?',
        options: ['Speed', 'Methodology', 'Guessing', 'Avoiding complexity']
      },
      {
        id: 'S022',
        question: 'What is data visualization used for?',
        options: ['Hiding information', 'Making data understandable', 'Complicating analysis', 'Reducing data']
      },
      {
        id: 'S023',
        question: 'Which best describes critical thinking?',
        options: ['Quick decisions', 'Careful analysis', 'Following others', 'Avoiding questions']
      },
      {
        id: 'S024',
        question: 'In statistics, what is the \'mean\'?',
        options: ['Most frequent value', 'Middle value', 'Average value', 'Highest value']
      },
      {
        id: 'S025',
        question: 'What is the primary purpose of A/B testing?',
        options: ['Confusing users', 'Comparing two versions', 'Reducing options', 'Eliminating features']
      }
    ],

    Situational: [
      {
        id: 'SJ001',
        question: 'You\'re assigned to a team project but one member isn\'t contributing. What do you do?',
        options: ['Report them to supervisor immediately', 'Do their work yourself', 'Talk to them privately first', 'Ignore the situation']
      },
      {
        id: 'SJ002',
        question: 'You discover a mistake in your completed work just before the deadline. You:',
        options: ['Submit it as is', 'Fix it even if it delays submission', 'Ask for extension', 'Blame external factors']
      },
      {
        id: 'SJ003',
        question: 'Your manager asks you to do something you believe is unethical. You:',
        options: ['Do it without question', 'Refuse immediately', 'Discuss your concerns', 'Quit your job']
      },
      {
        id: 'SJ004',
        question: 'You\'re overwhelmed with work and can\'t meet a deadline. You:',
        options: ['Work overnight to finish', 'Prioritize most important tasks', 'Ask for help', 'Submit incomplete work']
      },
      {
        id: 'SJ005',
        question: 'A customer is very angry about a service issue. Your first response:',
        options: ['Defend company policy', 'Listen to their concerns', 'Transfer to supervisor', 'Argue with them']
      },
      {
        id: 'SJ006',
        question: 'You disagree with your team\'s decision on a project approach. You:',
        options: ['Go along with majority', 'Present your alternative', 'Work independently', 'Complain privately']
      },
      {
        id: 'SJ007',
        question: 'You notice a colleague consistently arriving late. You:',
        options: ['Report them immediately', 'Mind your own business', 'Offer to help them', 'Talk to them about it']
      },
      {
        id: 'SJ008',
        question: 'You\'re asked to present to senior management tomorrow but feel unprepprepared. You:',
        options: ['Call in sick', 'Present anyway', 'Ask for more time', 'Delegate to someone else']
      },
      {
        id: 'SJ009',
        question: 'You receive harsh criticism on your work. You:',
        options: ['Get defensive', 'Listen and ask for specifics', 'Dismiss the feedback', 'Blame others']
      },
      {
        id: 'SJ010',
        question: 'A new team member is struggling with their tasks. You:',
        options: ['Let them figure it out', 'Complain to supervisor', 'Offer assistance', 'Do their work']
      },
      {
        id: 'SJ011',
        question: 'You have access to confidential information that could help a friend. You:',
        options: ['Share it discreetly', 'Keep it confidential', 'Hint at the information', 'Ask your supervisor']
      },
      {
        id: 'SJ012',
        question: 'You realize you don\'t have the skills needed for a new assignment. You:',
        options: ['Pretend you know how', 'Admit it and ask for training', 'Try to figure it out yourself', 'Delegate to others']
      },
      {
        id: 'SJ013',
        question: 'Two colleagues are in conflict affecting team productivity. You:',
        options: ['Take sides with one', 'Stay completely neutral', 'Facilitate communication', 'Report to management']
      },
      {
        id: 'SJ014',
        question: 'You\'re offered a promotion but it requires relocating. You:',
        options: ['Accept immediately', 'Decline immediately', 'Discuss with family first', 'Negotiate terms']
      },
      {
        id: 'SJ015',
        question: 'You discover your company is losing money due to inefficiency. You:',
        options: ['Ignore it', 'Document and report findings', 'Gossip about it', 'Look for new job']
      }
    ],

    Values: [
      {
        id: 'V001',
        question: 'What motivates you most in a career?',
        options: ['High salary and benefits', 'Personal growth and learning', 'Helping others and society', 'Recognition and status']
      },
      {
        id: 'V002',
        question: 'Your ideal work environment is:',
        options: ['Highly competitive', 'Collaborative and supportive', 'Independent and flexible', 'Structured and stable']
      },
      {
        id: 'V003',
        question: 'You value a job that offers:',
        options: ['Job security', 'Creative challenges', 'Leadership opportunities', 'Work-life balance']
      },
      {
        id: 'V004',
        question: 'When choosing a job, you prioritize:',
        options: ['Work-life balance', 'Career advancement', 'Meaningful work', 'Job security']
      },
      {
        id: 'V005',
        question: 'What type of recognition do you prefer?',
        options: ['Public acknowledgment', 'Private feedback', 'Monetary rewards', 'Increased responsibilities']
      },
      {
        id: 'V006',
        question: 'Your ideal company culture emphasizes:',
        options: ['Innovation and risk-taking', 'Tradition and stability', 'Teamwork and collaboration', 'Individual achievement']
      },
      {
        id: 'V007',
        question: 'In your career, you most want to:',
        options: ['Make a lot of money', 'Make a difference', 'Gain expertise', 'Build relationships']
      },
      {
        id: 'V008',
        question: 'You prefer work that is:',
        options: ['Routine and predictable', 'Varied and challenging', 'People-focused', 'Results-oriented']
      },
      {
        id: 'V009',
        question: 'What matters most in your role?',
        options: ['Autonomy and freedom', 'Clear structure and guidance', 'Opportunities to help others', 'Intellectual stimulation']
      },
      {
        id: 'V010',
        question: 'You\'re most satisfied when:',
        options: ['Exceeding targets', 'Learning new skills', 'Helping team members', 'Solving complex problems']
      },
      {
        id: 'V011',
        question: 'You define success as:',
        options: ['Financial achievements', 'Personal fulfillment', 'Recognition from others', 'Work-life harmony']
      },
      {
        id: 'V012',
        question: 'Your ideal manager:',
        options: ['Gives clear directions', 'Provides mentorship', 'Offers independence', 'Sets challenging goals']
      },
      {
        id: 'V013',
        question: 'You prefer feedback that is:',
        options: ['Immediate and direct', 'Detailed and constructive', 'Encouraging and supportive', 'Goal-oriented']
      },
      {
        id: 'V014',
        question: 'What drives your career decisions?',
        options: ['Passion for the work', 'Financial considerations', 'Family priorities', 'Growth opportunities']
      },
      {
        id: 'V015',
        question: 'In 5 years, you want to be:',
        options: ['In a leadership position', 'An expert in your field', 'Making a social impact', 'Maintaining work-life balance']
      }
    ]
  };

  const handleStartTest = (testId) => {
    console.log(`Starting test: ${testId}`);
    setActiveTest(testId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setActiveTest(null);
  };

  const handleTestComplete = (testId, results) => {
    console.log(`✅ Test "${testId}" completed with results:`, results);
    setShowModal(false);
    setActiveTest(null);
    
    // Add test to completed set (prevents duplicates)
    setCompletedTests(prev => new Set([...prev, testId]));
    
    // Update test status to completed - find and update the test
    const testIndex = tests.findIndex(test => test.id === testId);
    if (testIndex !== -1) {
      tests[testIndex].status = 'completed';
    }
  };

  const totalTests = tests.length;
  const completedCount = completedTests.size; // Use Set size for unique count
  const progressPercentage = (completedCount / totalTests) * 100;

  return (
    <div className="test-cards-container">
      <div className="section-header">
        <h2>Career Assessment Tests</h2>
        <p>Complete all assessments to get personalized career recommendations tailored to your profile</p>
      </div>

      <div className="progress-overview">
        <div className="progress-stats">
          <div className="progress-stat">
            <span className="stat-number">{completedCount}/{totalTests}</span>
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
                <span className={`status-badge ${completedTests.has(test.id) ? 'completed' : test.status}`}>
                  {completedTests.has(test.id) ? 'Completed' : 
                   test.status === 'not-started' ? 'Not Started' : 
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
                className={`start-test-btn ${completedTests.has(test.id) ? 'completed' : ''}`}
                onClick={() => handleStartTest(test.id)}
                style={{ backgroundColor: completedTests.has(test.id) ? '#48bb78' : test.color }}
                disabled={completedTests.has(test.id)}
              >
                <span>
                  {completedTests.has(test.id) ? 'Completed ✓' : 'Start Assessment'}
                </span>
                {!completedTests.has(test.id) && <span className="btn-arrow">→</span>}
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

      {/* Test Modal - Shows your complete 100 questions */}
      {showModal && activeTest && (
        <CompleteTestModal
          testType={activeTest}
          testData={tests.find(t => t.id === activeTest)}
          questions={assessmentQuestions[activeTest] || []}
          onClose={handleCloseModal}
          onComplete={(results) => handleTestComplete(activeTest, results)}
        />
      )}
    </div>
  );
};

// UPDATED Modal Component - Ready to Submit as clickable button
const CompleteTestModal = ({ testType, testData, questions, onClose, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [startTime] = useState(Date.now());

  // Safety checks - prevent undefined errors
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return (
      <div className="test-modal modal-overlay" onClick={onClose}>
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

  // Ensure currentQuestion is within bounds
  const safeCurrentQuestion = Math.max(0, Math.min(currentQuestion, questions.length - 1));
  const currentQ = questions[safeCurrentQuestion];

  if (!currentQ || !currentQ.options || !Array.isArray(currentQ.options)) {
    return (
      <div className="test-modal modal-overlay" onClick={onClose}>
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
    const minRequired = Math.min(8, Math.ceil(questions.length * 0.4)); // At least 8 or 40% of questions

    if (answeredCount < minRequired) {
      alert(`Please answer at least ${minRequired} questions before submitting the test. You have answered ${answeredCount} questions.`);
      return;
    }

    // Test completed
    const timeTaken = Math.round((Date.now() - startTime) / 60000);
    const results = {
      testType,
      responses: Object.values(answers),
      timeTaken,
      completionDate: new Date().toISOString(),
      totalQuestions: questions.length,
      answeredQuestions: answeredCount
    };
    
    console.log(`🎉 ${testType} Test submitted! Answered ${answeredCount}/${questions.length} questions`, results);
    onComplete(results);
  };

  const handleJumpToQuestion = (questionIndex) => {
    if (questionIndex >= 0 && questionIndex < questions.length) {
      setCurrentQuestion(questionIndex);
    }
  };

  const isFirstQuestion = safeCurrentQuestion === 0;
  const isLastQuestion = safeCurrentQuestion === questions.length - 1;
  const isAnswered = answers[currentQ?.id] !== undefined;
  const answeredCount = Object.keys(answers).length;
  const minRequired = Math.min(8, Math.ceil(questions.length * 0.4));
  const canSubmit = answeredCount >= minRequired;

  return (
    <div className="test-modal modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{testData?.icon || '📝'} {testData?.title || testType}</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
        
        {/* Progress Bar */}
        <div className="progress-bar-container">
          <div className="progress-bar-modal">
            <div 
              className="progress-fill-modal" 
              style={{ width: `${((safeCurrentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <div className="progress-text-modal">
            Question {safeCurrentQuestion + 1} of {questions.length} ({Math.round(((safeCurrentQuestion + 1) / questions.length) * 100)}%)
          </div>
        </div>
        
        <div className="question-container">
          <div className="question-header">
            <span className="question-number">Question {safeCurrentQuestion + 1}</span>
            <span className="question-category">{testData?.category || testType}</span>
          </div>
          
          <h3 className="question-text">{currentQ.question}</h3>
          
          <div className="options-list">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${answers[currentQ.id] && answers[currentQ.id].selectedOption === index ? 'selected' : ''}`}
                onClick={() => handleAnswer(currentQ.id, index)}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
                {answers[currentQ.id] && answers[currentQ.id].selectedOption === index && <span className="check-mark">✓</span>}
              </button>
            ))}
          </div>
          
          {/* Navigation Buttons */}
          <div className="modal-navigation">
            <button 
              onClick={handlePrevious}
              disabled={isFirstQuestion}
              className="prev-btn"
            >
              ← Previous
            </button>
            
            {/* Question Indicators */}
            <div className="question-indicators">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`indicator ${index === safeCurrentQuestion ? 'current' : ''} ${answers[questions[index]?.id] ? 'answered' : ''}`}
                  onClick={() => handleJumpToQuestion(index)}
                  title={`Question ${index + 1}`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
            
            <button 
              onClick={handleNext}
              disabled={!isAnswered}
              className="next-btn"
            >
              {isLastQuestion ? 'Submit Test ✓' : 'Next →'}
            </button>
          </div>

          {/* Answer Status - CLICKABLE Ready to Submit Button */}
          <div className="answer-status">
            <span>Answered: {answeredCount}/{questions.length} (Minimum {minRequired} required)</span>
            {/* CLICKABLE Ready to Submit Button with inline styles as fallback */}
            <button
              onClick={handleSubmitTest}
              disabled={!canSubmit}
              className={`ready-submit-btn ${canSubmit ? 'ready' : 'pending'}`}
              style={{
                // Inline styles as fallback
                background: canSubmit 
                  ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' 
                  : 'linear-gradient(135deg, #f87171 0%, #fca5a5 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '10px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                boxShadow: canSubmit 
                  ? '0 4px 12px rgba(16, 185, 129, 0.25), 0 2px 4px rgba(16, 185, 129, 0.1)' 
                  : '0 3px 10px rgba(248, 113, 113, 0.2), 0 1px 3px rgba(248, 113, 113, 0.1)',
                opacity: canSubmit ? '1' : '0.8'
              }}
              onMouseEnter={(e) => {
                if (canSubmit) {
                  e.target.style.background = 'linear-gradient(135deg, #059669 0%, #10b981 100%)';
                  e.target.style.transform = 'translateY(-2px) scale(1.02)';
                  e.target.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.35), 0 4px 8px rgba(16, 185, 129, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (canSubmit) {
                  e.target.style.background = 'linear-gradient(135deg, #10b981 0%, #34d399 100%)';
                  e.target.style.transform = 'translateY(0px) scale(1)';
                  e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.25), 0 2px 4px rgba(16, 185, 129, 0.1)';
                }
              }}
              onMouseDown={(e) => {
                if (canSubmit) {
                  e.target.style.transform = 'translateY(0px) scale(0.98)';
                }
              }}
              onMouseUp={(e) => {
                if (canSubmit) {
                  e.target.style.transform = 'translateY(-2px) scale(1.02)';
                }
              }}
            >
              {canSubmit ? '✓ Ready to Submit' : `⏳ Need ${minRequired - answeredCount} more answers`}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TestCards;